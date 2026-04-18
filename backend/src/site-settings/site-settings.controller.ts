import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('Site settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Public site copy bundle (merged with defaults)' })
  async getPublic() {
    return this.siteSettingsService.getPublicBundle();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Same as public bundle (admin auth)' })
  async getAdmin() {
    return this.siteSettingsService.getForAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update site copy (partial merge)' })
  async patch(@Body() dto: UpdateSiteSettingsDto) {
    return this.siteSettingsService.update(dto);
  }
}
