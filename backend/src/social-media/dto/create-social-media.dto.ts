import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialMediaDto {
  @ApiProperty({ example: 'Facebook' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://example.com/icon.png' })
  @IsUrl()
  icon_url: string;

  @ApiProperty({ example: 'https://facebook.com/the247care' })
  @IsUrl()
  href: string;
}
