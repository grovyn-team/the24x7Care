import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { EnquiryStatus } from '../schemas/enquiry.schema';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new enquiry (public)' })
  async create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiriesService.create(createEnquiryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enquiries (admin/doctor)' })
  @ApiQuery({ name: 'status', enum: EnquiryStatus, required: false })
  @ApiQuery({ name: 'assignee', required: false })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: EnquiryStatus,
    @Query('assignee') assignee?: string,
  ) {
    return this.enquiriesService.findAll(
      pagination.page,
      pagination.limit,
      status,
      assignee,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enquiry by ID' })
  async findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update enquiry (admin can delete, doctor can only update status)' })
  async update(@Param('id') id: string, @Body() updateEnquiryDto: UpdateEnquiryDto) {
    return this.enquiriesService.update(id, updateEnquiryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete enquiry (admin only)' })
  async remove(@Param('id') id: string) {
    return this.enquiriesService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('export/all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enquiries for export (admin only)' })
  @ApiQuery({ name: 'status', enum: EnquiryStatus, required: false })
  @ApiQuery({ name: 'assignee', required: false })
  async findAllForExport(
    @Query('status') status?: EnquiryStatus,
    @Query('assignee') assignee?: string,
  ) {
    return this.enquiriesService.findAllForExport(status, assignee);
  }
}
