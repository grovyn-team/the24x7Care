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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { BulkCreateDoctorDto } from './dto/bulk-create-doctor.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
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
    private readonly cloudinaryService: CloudinaryService,
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

  @Roles(UserRole.ADMIN)
  @Get('export/all')
  @ApiOperation({ summary: 'Get all doctors for export (admin only)' })
  async findAllForExport() {
    return this.doctorsService.findAllForExport();
  }

  @Roles(UserRole.ADMIN)
  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create doctors (admin only)' })
  async createBulk(@Body() bulkCreateDoctorDto: BulkCreateDoctorDto) {
    return this.doctorsService.createBulk(bulkCreateDoctorDto.doctors);
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @Get('my-enquiries')
  @ApiOperation({ summary: 'Get enquiries assigned to current doctor' })
  async getMyEnquiries(
    @CurrentUser() user: any,
    @Query() pagination: PaginationDto,
  ) {
    const doctor = await this.doctorsService.findByEmployeeId(user.doctorId);
    return this.enquiriesService.findByAssignee(
      doctor._id.toString(),
      pagination.page,
      pagination.limit,
    );
  }

  @Roles(UserRole.DOCTOR)
  @Get('me/profile')
  @ApiOperation({ summary: 'Get current doctor profile' })
  async getMyProfile(@CurrentUser() user: any) {
    const doctor = await this.doctorsService.findByEmployeeId(user.doctorId);
    return doctor;
  }

  @Roles(UserRole.DOCTOR)
  @Patch('me/profile')
  @ApiOperation({ summary: 'Update current doctor profile' })
  async updateMyProfile(
    @CurrentUser() user: any,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    const doctor = await this.doctorsService.findByEmployeeId(user.doctorId);
    const { employee_id, ...allowedUpdates } = updateDoctorDto as any;
    return this.doctorsService.update(doctor._id.toString(), allowedUpdates);
  }

  @Roles(UserRole.DOCTOR)
  @Patch('me/availability')
  @ApiOperation({ summary: 'Update current doctor availability' })
  async updateMyAvailability(
    @CurrentUser() user: any,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.doctorsService.updateAvailability(user.doctorId, updateAvailabilityDto.availability);
  }

  @Roles(UserRole.DOCTOR)
  @Post('me/upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload doctor avatar image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    const doctor = await this.doctorsService.findByEmployeeId(user.doctorId);
    const oldAvatarUrl = doctor.avatar_url;
    
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    
    if (oldAvatarUrl) {
      const oldPublicId = this.cloudinaryService.extractPublicIdFromUrl(oldAvatarUrl);
      if (oldPublicId) {
        this.cloudinaryService.deleteImage(oldPublicId).catch((error) => {
          console.error('Failed to delete old avatar from Cloudinary:', error);
        });
      }
    }
    
    await this.doctorsService.update(doctor._id.toString(), { avatar_url: imageUrl });
    
    return { url: imageUrl };
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
}
