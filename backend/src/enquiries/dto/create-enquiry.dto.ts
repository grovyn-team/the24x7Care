import { IsString, IsNumber, Min, Max, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'I need a consultation for my health condition', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  message: string;
}
