import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DOCTOR)
@ApiBearerAuth()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('export/all')
  @ApiOperation({ summary: 'Get all patients for export' })
  async findAllForExport() {
    return this.patientsService.findAllForExport();
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  async findAll(@Query() pagination: PaginationDto) {
    return this.patientsService.findAll(pagination.page, pagination.limit);
  }

  @Get(':mobile')
  @ApiOperation({ summary: 'Get patient by mobile number' })
  async findOne(@Param('mobile') mobile: string) {
    return this.patientsService.findOne(mobile);
  }
}
