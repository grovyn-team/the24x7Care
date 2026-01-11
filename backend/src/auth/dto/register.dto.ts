import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../schemas/user.schema';

export class RegisterDto {
  @ApiProperty({ example: 'doctor@the247care.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.DOCTOR })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false, example: 'DOC001' })
  @IsString()
  doctorId?: string;
}
