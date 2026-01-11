import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  LeadershipTeam,
  LeadershipTeamDocument,
} from '../schemas/leadership-team.schema';
import { CreateLeadershipTeamDto } from './dto/create-leadership-team.dto';
import { UpdateLeadershipTeamDto } from './dto/update-leadership-team.dto';

@Injectable()
export class LeadershipTeamService {
  constructor(
    @InjectModel(LeadershipTeam.name)
    private leadershipTeamModel: Model<LeadershipTeamDocument>,
  ) {}

  async create(createLeadershipTeamDto: CreateLeadershipTeamDto) {
    const leadershipTeam = new this.leadershipTeamModel({
      ...createLeadershipTeamDto,
      member_id: new Types.ObjectId(createLeadershipTeamDto.member_id),
    });
    return leadershipTeam.save();
  }

  async findAll() {
    return this.leadershipTeamModel
      .find()
      .populate('member_id', 'name specialization avatar_url')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const leadershipTeam = await this.leadershipTeamModel
      .findById(id)
      .populate('member_id', 'name specialization avatar_url')
      .exec();
    if (!leadershipTeam) {
      throw new NotFoundException(`Leadership team member with ID ${id} not found`);
    }
    return leadershipTeam;
  }

  async update(id: string, updateLeadershipTeamDto: UpdateLeadershipTeamDto) {
    const leadershipTeam = await this.leadershipTeamModel.findById(id).exec();
    if (!leadershipTeam) {
      throw new NotFoundException(`Leadership team member with ID ${id} not found`);
    }
    if (updateLeadershipTeamDto.member_id) {
      updateLeadershipTeamDto.member_id = new Types.ObjectId(
        updateLeadershipTeamDto.member_id,
      ) as any;
    }
    Object.assign(leadershipTeam, updateLeadershipTeamDto);
    return leadershipTeam.save();
  }

  async remove(id: string) {
    const leadershipTeam = await this.leadershipTeamModel.findByIdAndDelete(id).exec();
    if (!leadershipTeam) {
      throw new NotFoundException(`Leadership team member with ID ${id} not found`);
    }
    return { message: 'Leadership team member deleted successfully' };
  }
}
