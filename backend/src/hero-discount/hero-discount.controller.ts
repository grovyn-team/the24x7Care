import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HeroDiscountService } from './hero-discount.service';
import { UpdateHeroDiscountDto } from './dto/update-hero-discount.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('Hero Discount')
@Controller('hero-discount')
export class HeroDiscountController {
  constructor(private readonly heroDiscountService: HeroDiscountService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get hero section discount (public)' })
  async getDiscount() {
    return this.heroDiscountService.getDiscount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hero section discount (admin only)' })
  async updateDiscount(@Body() updateHeroDiscountDto: UpdateHeroDiscountDto) {
    return this.heroDiscountService.updateDiscount(updateHeroDiscountDto);
  }
}
