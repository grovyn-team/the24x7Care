import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';

export class BulkCreateDoctorDto {
  @ApiProperty({ type: [CreateDoctorDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDoctorDto)
  doctors: CreateDoctorDto[];
}
