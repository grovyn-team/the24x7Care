import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeadershipTeamService } from './leadership-team.service';
import { CreateLeadershipTeamDto } from './dto/create-leadership-team.dto';
import { UpdateLeadershipTeamDto } from './dto/update-leadership-team.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('Leadership Team')
@Controller('leadership-team')
export class LeadershipTeamController {
  constructor(private readonly leadershipTeamService: LeadershipTeamService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all leadership team members (public)' })
  async findAll() {
    return this.leadershipTeamService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get leadership team member by ID (public)' })
  async findOne(@Param('id') id: string) {
    return this.leadershipTeamService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add leadership team member (admin only)' })
  async create(@Body() createLeadershipTeamDto: CreateLeadershipTeamDto) {
    return this.leadershipTeamService.create(createLeadershipTeamDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update leadership team member (admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateLeadershipTeamDto: UpdateLeadershipTeamDto,
  ) {
    return this.leadershipTeamService.update(id, updateLeadershipTeamDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove leadership team member (admin only)' })
  async remove(@Param('id') id: string) {
    return this.leadershipTeamService.remove(id);
  }
}
