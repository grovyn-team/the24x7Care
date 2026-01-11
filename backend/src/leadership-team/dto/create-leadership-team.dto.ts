import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadershipTeamDto {
  @ApiProperty({ example: 'Chief Medical Officer' })
  @IsString()
  designation: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  member_id: string;
}
