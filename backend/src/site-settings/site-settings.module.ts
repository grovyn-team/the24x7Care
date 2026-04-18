import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteSettings, SiteSettingsSchema } from '../schemas/site-settings.schema';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsController } from './site-settings.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: SiteSettings.name, schema: SiteSettingsSchema }])],
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule implements OnModuleInit {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  async onModuleInit() {
    await this.siteSettingsService.ensureSeeded();
  }
}
