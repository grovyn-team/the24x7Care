import { IsString, Matches, IsEnum, IsOptional } from 'class-validator';
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
}
