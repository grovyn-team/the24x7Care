import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreValuesService } from './core-values.service';
import { CoreValuesController } from './core-values.controller';
import { CoreValue, CoreValueSchema } from '../schemas/core-value.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CoreValue.name, schema: CoreValueSchema }])],
  controllers: [CoreValuesController],
  providers: [CoreValuesService],
  exports: [CoreValuesService],
})
export class CoreValuesModule {}
