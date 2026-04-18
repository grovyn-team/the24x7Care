import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class BulkDeleteDto {
  @ApiProperty({ type: [String], example: ['507f1f77bcf86cd799439011'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  ids: string[];
}

