import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>) {}

  async create(createServiceDto: CreateServiceDto) {
    const service = new this.serviceModel({
      ...createServiceDto,
      book_via: createServiceDto.book_via || '0000000000',
    });
    return service.save();
  }

  async findAll() {
    return this.serviceModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    Object.assign(service, updateServiceDto);
    return service.save();
  }

  async remove(id: string) {
    const service = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return { message: 'Service deleted successfully' };
  }
}
