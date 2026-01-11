import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { EnquiriesService } from '../enquiries/enquiries.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Doctors')
@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly enquiriesService: EnquiriesService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new doctor (admin only)' })
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  async findAll(@Query() pagination: PaginationDto) {
    return this.doctorsService.findAll(pagination.page, pagination.limit);
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @Get('my-enquiries')
  @ApiOperation({ summary: 'Get enquiries assigned to current doctor' })
  async getMyEnquiries(
    @CurrentUser() user: any,
    @Query() pagination: PaginationDto,
  ) {
    // Get doctor by user's doctorId
    const doctor = await this.doctorsService.findByEmployeeId(user.doctorId);
    return this.enquiriesService.findByAssignee(
      doctor._id.toString(),
      pagination.page,
      pagination.limit,
    );
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update doctor (admin only)' })
  async update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete doctor (admin only)' })
  async remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }

  @Roles(UserRole.ADMIN)
  @Get('export/all')
  @ApiOperation({ summary: 'Get all doctors for export (admin only)' })
  async findAllForExport() {
    return this.doctorsService.findAllForExport();
  }
}
