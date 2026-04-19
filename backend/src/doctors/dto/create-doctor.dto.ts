import { IsString, Matches, IsEnum, IsOptional, IsEmail, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../schemas/doctor.schema';

export class CreateDoctorDto {
  @ApiProperty({ example: 'Dr. John Smith' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  specialization: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;

  @ApiProperty({ example: 'DOC001' })
  @IsString()
  employee_id: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ required: false, example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty({
    required: false,
    description: 'Doctor portal login email (must be used with login_password)',
  })
  @IsOptional()
  @IsEmail()
  login_email?: string;

  @ApiProperty({
    required: false,
    description: 'Initial portal password, min 8 characters (must be used with login_email)',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  login_password?: string;

  @ApiProperty({
    required: false,
    description: 'If true and Resend is configured, sends welcome email with temporary password',
  })
  @IsOptional()
  @IsBoolean()
  send_portal_welcome_email?: boolean;
}
