import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadershipTeamService } from './leadership-team.service';
import { LeadershipTeamController } from './leadership-team.controller';
import {
  LeadershipTeam,
  LeadershipTeamSchema,
} from '../schemas/leadership-team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeadershipTeam.name, schema: LeadershipTeamSchema },
    ]),
  ],
  controllers: [LeadershipTeamController],
  providers: [LeadershipTeamService],
  exports: [LeadershipTeamService],
})
export class LeadershipTeamModule {}
