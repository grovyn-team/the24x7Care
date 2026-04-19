import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../common/decorators/public.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetOtpDto } from './dto/verify-reset-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordVerifiedDto } from './dto/reset-password-verified.dto';
import {
  ChangePasswordDto,
  SendChangePasswordOtpDto,
} from './dto/change-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset OTP (doctor accounts only)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendResetPasswordEmailOTP(dto.email);
  }

  @Public()
  @Post('verify-reset-password')
  @ApiOperation({ summary: 'Verify reset OTP (step before setting new password)' })
  async verifyResetPassword(@Body() dto: VerifyResetOtpDto) {
    return this.authService.verifyResetPasswordOTP(dto.email, dto.otp);
  }

  @Public()
  @Post('reset-password-verified')
  @ApiOperation({ summary: 'Set new password after verify-reset-password' })
  async resetPasswordVerified(@Body() dto: ResetPasswordVerifiedDto) {
    return this.authService.resetPasswordVerified(dto.email, dto.newPassword);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP in one step (returns tokens)' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('send-change-password-otp')
  @ApiOperation({ summary: 'Send OTP to email for password change' })
  async sendChangePasswordOtp(
    @CurrentUser() user: { userId: string },
    @Body() dto: SendChangePasswordOtpDto,
  ) {
    return this.authService.sendChangePasswordEmailOTP(user.userId, dto.oldPassword);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({ summary: 'Change password using OTP from email' })
  async changePassword(
    @CurrentUser() user: { userId: string },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.userId,
      dto.oldPassword,
      dto.newPassword,
      dto.otp,
    );
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user);
  }
}
