import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'enquiry_id_here' })
  @IsString()
  enquiry_id: string;

  @ApiProperty({ example: 'INR', required: false })
  @IsOptional()
  @IsString()
  currency?: string;
}
