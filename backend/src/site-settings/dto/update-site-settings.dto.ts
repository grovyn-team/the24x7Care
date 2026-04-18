import { IsArray, IsObject, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  hero?: Record<string, string | undefined>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  footer?: Record<string, string | undefined>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    rating?: number;
    avatar?: string;
  }>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  statistics?: Array<{ value: string; label: string }>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  about?: Record<string, unknown>;
}
