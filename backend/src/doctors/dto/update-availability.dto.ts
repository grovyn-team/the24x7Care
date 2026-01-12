import { IsArray, ValidateNested, IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

class DayAvailabilityDto {
  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @ApiProperty({ required: false, example: '09:00' })
  @IsOptional()
  @IsString()
  startTime?: string | null;

  @ApiProperty({ required: false, example: '17:00' })
  @IsOptional()
  @IsString()
  endTime?: string | null;

  @ApiProperty({ default: true })
  @IsBoolean()
  isAvailable: boolean;
}

export class UpdateAvailabilityDto {
  @ApiProperty({ type: [DayAvailabilityDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayAvailabilityDto)
  availability: DayAvailabilityDto[];
}
