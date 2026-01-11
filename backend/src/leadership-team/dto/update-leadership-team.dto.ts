import { PartialType } from '@nestjs/swagger';
import { CreateLeadershipTeamDto } from './create-leadership-team.dto';

export class UpdateLeadershipTeamDto extends PartialType(CreateLeadershipTeamDto) {}
