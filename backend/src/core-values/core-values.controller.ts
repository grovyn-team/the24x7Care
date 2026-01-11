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
import { CoreValuesService } from './core-values.service';
import { CreateCoreValueDto } from './dto/create-core-value.dto';
import { UpdateCoreValueDto } from './dto/update-core-value.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('Core Values')
@Controller('core-values')
export class CoreValuesController {
  constructor(private readonly coreValuesService: CoreValuesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all core values (public)' })
  async findAll() {
    return this.coreValuesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get core value by ID (public)' })
  async findOne(@Param('id') id: string) {
    return this.coreValuesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create core value (admin only)' })
  async create(@Body() createCoreValueDto: CreateCoreValueDto) {
    return this.coreValuesService.create(createCoreValueDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update core value (admin only)' })
  async update(@Param('id') id: string, @Body() updateCoreValueDto: UpdateCoreValueDto) {
    return this.coreValuesService.update(id, updateCoreValueDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete core value (admin only)' })
  async remove(@Param('id') id: string) {
    return this.coreValuesService.remove(id);
  }
}
