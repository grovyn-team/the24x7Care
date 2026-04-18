import { IsString, IsUrl, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSocialMediaDto {
  @ApiProperty({ example: 'Facebook' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://example.com/icon.png', required: false, nullable: true })
  @Transform(({ value }) => {
    if (value === null) return null;
    if (typeof value === 'string' && value.trim() === '') return undefined;
    return value;
  })
  @IsOptional()
  @ValidateIf((_, v) => v != null)
  @IsUrl()
  icon_url?: string | null;

  @ApiProperty({ example: 'https://facebook.com/the247care' })
  @IsUrl()
  href: string;
}
