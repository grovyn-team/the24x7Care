import { IsString, IsNumber, Min, Max, MaxLength, Matches, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const SERVICE_OPTIONS = [
  'Medical Equipment on rent',
  'ICU and Ventilation Setup',
  'Home Care',
  'Doctor Consultation',
  'Second Opinion',
] as const;

export class CreateEnquiryDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  patient_name: string;

  @ApiProperty({ example: 35, minimum: 1, maximum: 99 })
  @IsNumber()
  @Min(1)
  @Max(99)
  patient_age: number;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  patient_mob: string;

  @ApiProperty({ example: 'I need a consultation for my health condition', maxLength: 200, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  message?: string;

  @ApiProperty({ 
    example: 'Doctor Consultation',
    enum: SERVICE_OPTIONS,
    description: 'Selected service type'
  })
  @IsString()
  @IsIn(SERVICE_OPTIONS)
  service: string;
}
