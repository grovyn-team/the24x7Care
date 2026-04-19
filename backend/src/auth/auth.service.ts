import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../schemas/user.schema';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';

const SALT_ROUNDS = 10;
const OTP_TTL_SECONDS = 300;
const OTP_LENGTH = 6;
const OTP_VERIFIED_TTL_SECONDS = 600;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly emailService: EmailService,
  ) {
    void this.initializeAdmin();
  }

  normalizeEmail(email: string): string {
    return String(email ?? '')
      .trim()
      .toLowerCase();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const emailKey = this.normalizeEmail(email);
    const user = await this.userModel.findOne({ email: emailKey }).exec();
    if (!user?.password) {
      return null;
    }
    if (await bcrypt.compare(password, user.password)) {
      const { password: _pw, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto) {
    const emailKey = this.normalizeEmail(registerDto.email);
    const hashedPassword = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const user = new this.userModel({
      email: emailKey,
      password: hashedPassword,
      role: registerDto.role,
      doctorId: registerDto.doctorId,
    });
    await user.save();
    const { password, ...result } = user.toObject();
    return result;
  }

  async googleLogin(user: any) {
    const emailKey = this.normalizeEmail(user.email);
    let dbUser = await this.userModel.findOne({ email: emailKey }).exec();

    if (!dbUser) {
      dbUser = new this.userModel({
        email: emailKey,
        password: '',
        role: UserRole.DOCTOR,
        googleId: user.googleId,
      });
      await dbUser.save();
    } else if (!dbUser.googleId) {
      dbUser.googleId = user.googleId;
      await dbUser.save();
    }

    return this.generateTokens(dbUser.toObject());
  }

  async generateTokens(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      doctorId: user.doctorId || null,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        doctorId: user.doctorId || null,
      },
    };
  }

  async sendResetPasswordEmailOTP(
    email: string,
  ): Promise<{ message: string; seconds_remaining?: number }> {
    const emailKey = this.normalizeEmail(email);
    const cooldownKey = `care247:otp:reset:cooldown:${emailKey}`;
    const cooldownTtl = await this.redis.ttl(cooldownKey);
    if (cooldownTtl > 0) {
      throw new HttpException(
        {
          message: 'Please wait before requesting another OTP.',
          seconds_remaining: cooldownTtl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.userModel.findOne({ email: emailKey }).exec();
    if (!user || user.role !== UserRole.DOCTOR) {
      return { message: 'If an account exists, an OTP has been sent to your email.' };
    }

    const otp = Math.floor(Math.random() * 10 ** OTP_LENGTH)
      .toString()
      .padStart(OTP_LENGTH, '0');

    await this.redis.set(`care247:otp:reset:${emailKey}`, otp, 'EX', OTP_TTL_SECONDS);
    await this.emailService.sendOtpEmail(emailKey, otp);
    await this.redis.set(cooldownKey, '1', 'EX', 60);

    return { message: 'If an account exists, an OTP has been sent to your email.' };
  }

  async verifyResetPasswordOTP(email: string, otp: string): Promise<{ verified: true }> {
    const emailKey = this.normalizeEmail(email);
    const storedOtp = await this.redis.get(`care247:otp:reset:${emailKey}`);
    const normalizedOtp = String(otp ?? '').trim();

    if (!storedOtp || storedOtp.trim() !== normalizedOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.redis.del(`care247:otp:reset:${emailKey}`);
    await this.redis.set(
      `care247:otp:reset:verified:${emailKey}`,
      '1',
      'EX',
      OTP_VERIFIED_TTL_SECONDS,
    );
    return { verified: true };
  }

  async resetPasswordVerified(email: string, newPassword: string): Promise<{ message: string }> {
    const emailKey = this.normalizeEmail(email);
    const isVerified = await this.redis.get(`care247:otp:reset:verified:${emailKey}`);
    if (!isVerified) {
      throw new UnauthorizedException(
        'OTP not verified or session expired. Please restart.',
      );
    }
    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    await this.redis.del(`care247:otp:reset:verified:${emailKey}`);
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const user = await this.userModel.findOne({ email: emailKey }).exec();
    if (!user || user.role !== UserRole.DOCTOR) {
      throw new UnauthorizedException('User not found');
    }
    user.password = hashedPassword;
    await user.save();
    return { message: 'Password reset successfully.' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const emailKey = this.normalizeEmail(email);
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    const storedOtp = await this.redis.get(`care247:otp:reset:${emailKey}`);
    const normalizedOtp = String(otp ?? '').trim();

    if (!storedOtp || storedOtp.trim() !== normalizedOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.redis.del(`care247:otp:reset:${emailKey}`);

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const user = await this.userModel.findOne({ email: emailKey }).exec();
    if (!user || user.role !== UserRole.DOCTOR) {
      throw new UnauthorizedException('User not found');
    }
    user.password = hashedPassword;
    await user.save();
    const refreshed = await this.userModel.findById(user._id).exec();
    return this.generateTokens(refreshed!.toObject());
  }

  async sendChangePasswordEmailOTP(
    userId: string,
    oldPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.password) {
      throw new BadRequestException('Password change is not available for this account.');
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new HttpException(
        {
          message: 'Incorrect current password. Please try again.',
          code: 'WRONG_OLD_PASSWORD',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const otp = Math.floor(Math.random() * 10 ** OTP_LENGTH)
      .toString()
      .padStart(OTP_LENGTH, '0');
    await this.redis.set(`care247:otp:change:${user.id}`, otp, 'EX', OTP_TTL_SECONDS);
    await this.emailService.sendOtpEmail(user.email, otp);
    return { message: 'OTP sent to your email.' };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    otp: string,
  ): Promise<{ message: string }> {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    if (!oldPassword) {
      throw new BadRequestException('Current password is required');
    }
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('Incorrect current password');
    }

    const storedOtp = await this.redis.get(`care247:otp:change:${user.id}`);
    const normalizedOtp = String(otp ?? '').trim();
    if (!storedOtp || storedOtp.trim() !== normalizedOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.redis.del(`care247:otp:change:${user.id}`);

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    await user.save();
    return { message: 'Password changed successfully' };
  }

  async upsertDoctorPortalAccount(
    employeeId: string,
    email: string,
    password: string,
    options?: { sendWelcome?: boolean; doctorName?: string },
  ): Promise<void> {
    const emailKey = this.normalizeEmail(email);
    if (password.length < 8) {
      throw new BadRequestException('Portal password must be at least 8 characters');
    }
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const byEmployee = await this.userModel
      .findOne({ doctorId: employeeId, role: UserRole.DOCTOR })
      .exec();

    const emailOwner = await this.userModel.findOne({ email: emailKey }).exec();
    if (emailOwner && (!byEmployee || String(emailOwner._id) !== String(byEmployee._id))) {
      throw new ConflictException('That email is already used by another account');
    }

    if (byEmployee) {
      byEmployee.email = emailKey;
      byEmployee.password = hashed;
      await byEmployee.save();
    } else {
      await this.userModel.create({
        email: emailKey,
        password: hashed,
        role: UserRole.DOCTOR,
        doctorId: employeeId,
      });
    }

    if (options?.sendWelcome) {
      await this.emailService.sendDoctorWelcomeEmail(
        emailKey,
        options.doctorName || 'Doctor',
        password,
      );
    }
  }

  async getPortalEmailsByEmployeeIds(
    employeeIds: string[],
  ): Promise<Record<string, string>> {
    if (!employeeIds.length) {
      return {};
    }
    const users = await this.userModel
      .find({ doctorId: { $in: employeeIds }, role: UserRole.DOCTOR })
      .select('doctorId email')
      .lean()
      .exec();
    const map: Record<string, string> = {};
    for (const u of users) {
      if (u.doctorId) {
        map[u.doctorId as string] = u.email as string;
      }
    }
    return map;
  }

  async deletePortalUserByEmployeeId(employeeId: string): Promise<void> {
    await this.userModel
      .deleteMany({ doctorId: employeeId, role: UserRole.DOCTOR })
      .exec();
  }

  async updateDoctorPortalPassword(employeeId: string, newPassword: string): Promise<void> {
    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    const user = await this.userModel
      .findOne({ doctorId: employeeId, role: UserRole.DOCTOR })
      .exec();
    if (!user) {
      throw new BadRequestException(
        'No portal account exists for this doctor. Add login email and password together first.',
      );
    }
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();
  }

  async updateDoctorPortalEmailOnly(employeeId: string, newEmail: string): Promise<void> {
    const emailKey = this.normalizeEmail(newEmail);
    const user = await this.userModel
      .findOne({ doctorId: employeeId, role: UserRole.DOCTOR })
      .exec();
    if (!user) {
      throw new BadRequestException(
        'No portal account exists for this doctor. Add login email and password together first.',
      );
    }
    const owner = await this.userModel.findOne({ email: emailKey }).exec();
    if (owner && String(owner._id) !== String(user._id)) {
      throw new ConflictException('That email is already used by another account');
    }
    user.email = emailKey;
    await user.save();
  }

  private async initializeAdmin() {
    const adminEmail = this.normalizeEmail(
      process.env.ADMIN_EMAIL || 'admin@the247care.com',
    );
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const adminExists = await this.userModel.findOne({ email: adminEmail }).exec();
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
      const admin = new this.userModel({
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await admin.save();
      console.log('Default admin user created');
    }
  }
}
