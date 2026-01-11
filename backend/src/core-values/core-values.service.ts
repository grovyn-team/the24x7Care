import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoreValue, CoreValueDocument } from '../schemas/core-value.schema';
import { CreateCoreValueDto } from './dto/create-core-value.dto';
import { UpdateCoreValueDto } from './dto/update-core-value.dto';

@Injectable()
export class CoreValuesService {
  constructor(
    @InjectModel(CoreValue.name) private coreValueModel: Model<CoreValueDocument>,
  ) {}

  async create(createCoreValueDto: CreateCoreValueDto) {
    const coreValue = new this.coreValueModel(createCoreValueDto);
    return coreValue.save();
  }

  async findAll() {
    return this.coreValueModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const coreValue = await this.coreValueModel.findById(id).exec();
    if (!coreValue) {
      throw new NotFoundException(`Core value with ID ${id} not found`);
    }
    return coreValue;
  }

  async update(id: string, updateCoreValueDto: UpdateCoreValueDto) {
    const coreValue = await this.coreValueModel.findById(id).exec();
    if (!coreValue) {
      throw new NotFoundException(`Core value with ID ${id} not found`);
    }
    Object.assign(coreValue, updateCoreValueDto);
    return coreValue.save();
  }

  async remove(id: string) {
    const coreValue = await this.coreValueModel.findByIdAndDelete(id).exec();
    if (!coreValue) {
      throw new NotFoundException(`Core value with ID ${id} not found`);
    }
    return { message: 'Core value deleted successfully' };
  }
}
