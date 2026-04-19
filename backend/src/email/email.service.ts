import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor(private readonly config: ConfigService) {
    const key =
      this.config.get<string>('CARE247_RESEND_API_KEY') ||
      this.config.get<string>('RESEND_API_KEY');
    if (key) {
      this.resend = new Resend(key);
    }
  }

  private fromAddress(): string {
    return (
      this.config.get<string>('CARE247_EMAIL_FROM') ||
      this.config.get<string>('EMAIL_FROM') ||
      'The24x7Care <no-reply@the247care.com>'
    );
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 560px;">
        <h2 style="color: #0f766e;">The24x7Care</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 0.15em;">${escapeHtml(otp)}</h1>
        <p style="color: #555;">This code expires in 5 minutes.</p>
      </div>
    `;

    if (!this.resend) {
      if (this.config.get<string>('NODE_ENV') !== 'production') {
        this.logger.warn(`[dev] OTP for ${to}: ${otp} (set CARE247_RESEND_API_KEY to send email)`);
        return;
      }
      throw new Error('Email is not configured. Set CARE247_RESEND_API_KEY.');
    }

    const { error } = await this.resend.emails.send({
      from: this.fromAddress(),
      to: [to],
      subject: 'Your The24x7Care verification code',
      html,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async sendDoctorWelcomeEmail(
    to: string,
    name: string,
    plainPassword: string,
  ): Promise<void> {
    const loginUrl =
      this.config.get<string>('CARE247_DOCTOR_LOGIN_URL') ||
      `${(this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000').split(',')[0].trim()}/doctor/login`;
    const safeName = escapeHtml(name || 'Doctor');
    const safePassword = escapeHtml(plainPassword);

    const html = `
      <div style="font-family: system-ui, sans-serif; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px;">
        <h2 style="color: #0f766e; margin-top: 0;">Welcome to The24x7Care</h2>
        <p>Hello ${safeName},</p>
        <p>Your doctor portal account is ready.</p>
        <div style="background: #f0fdfa; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px;"><b>Email:</b> ${escapeHtml(to)}</p>
          <p style="margin: 0;"><b>Temporary password:</b> <span style="font-family: monospace;">${safePassword}</span></p>
        </div>
        <p style="font-size: 14px; color: #444;">Please sign in and change your password under Profile for security.</p>
        <p><a href="${escapeHtml(loginUrl)}" style="color: #0f766e;">Open doctor login</a></p>
      </div>
    `;

    if (!this.resend) {
      if (this.config.get<string>('NODE_ENV') !== 'production') {
        this.logger.warn(`[dev] Welcome email skipped for ${to}; password was set in admin.`);
        return;
      }
      return;
    }

    const { error } = await this.resend.emails.send({
      from: this.fromAddress(),
      to: [to],
      subject: 'Your The24x7Care doctor portal access',
      html,
    });

    if (error) {
      this.logger.warn(`Welcome email failed: ${error.message}`);
    }
  }
}
