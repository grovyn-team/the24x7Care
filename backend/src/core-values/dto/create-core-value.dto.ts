import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoreValueDto {
  @ApiProperty({ example: 'https://example.com/icon.png' })
  @IsUrl()
  icon_url: string;

  @ApiProperty({ example: 'Compassion' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'We treat every patient with dignity...' })
  @IsString()
  description: string;
}
