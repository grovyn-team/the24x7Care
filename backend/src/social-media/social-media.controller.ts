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
import { SocialMediaService } from './social-media.service';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('Social Media')
@Controller('social-media')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all social media links (public)' })
  async findAll() {
    return this.socialMediaService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get social media by ID (public)' })
  async findOne(@Param('id') id: string) {
    return this.socialMediaService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create social media link (admin only)' })
  async create(@Body() createSocialMediaDto: CreateSocialMediaDto) {
    return this.socialMediaService.create(createSocialMediaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update social media link (admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateSocialMediaDto: UpdateSocialMediaDto,
  ) {
    return this.socialMediaService.update(id, updateSocialMediaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete social media link (admin only)' })
  async remove(@Param('id') id: string) {
    return this.socialMediaService.remove(id);
  }
}
