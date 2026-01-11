import { PartialType } from '@nestjs/swagger';
import { CreateEnquiryDto } from './create-enquiry.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnquiryStatus } from '../../schemas/enquiry.schema';

export class UpdateEnquiryDto extends PartialType(CreateEnquiryDto) {
  @ApiProperty({ enum: EnquiryStatus, required: false })
  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignee?: string;
}
