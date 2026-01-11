import { IsString, IsArray, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Post-Surgery Care' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Comprehensive recovery support...' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['Wound care', 'Medication management'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  perks: string[];

  @ApiProperty({ example: '9876543210', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  book_via?: string;
}
