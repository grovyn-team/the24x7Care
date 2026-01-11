import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {
    this.initializeAdmin();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
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
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = new this.userModel({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
      doctorId: registerDto.doctorId,
    });
    await user.save();
    const { password, ...result } = user.toObject();
    return result;
  }

  async googleLogin(user: any) {
    let dbUser = await this.userModel.findOne({ email: user.email }).exec();
    
    if (!dbUser) {
      // Create new user with Google OAuth
      dbUser = new this.userModel({
        email: user.email,
        password: '', // No password for OAuth users
        role: UserRole.DOCTOR, // Default role, can be changed
        googleId: user.googleId,
      });
      await dbUser.save();
    } else if (!dbUser.googleId) {
      // Link Google account to existing user
      dbUser.googleId = user.googleId;
      await dbUser.save();
    }

    return this.generateTokens(dbUser.toObject());
  }

  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async initializeAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@the247care.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const adminExists = await this.userModel.findOne({ email: adminEmail }).exec();
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
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
