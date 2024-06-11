import { Injectable } from '@nestjs/common';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';

@Injectable()
export class PropertyTypesService {
  create(createPropertyTypeDto: CreatePropertyTypeDto) {
    return 'This action adds a new propertyType';
  }

  findAll() {
    return `This action returns all propertyTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} propertyType`;
  }

  update(id: number, updatePropertyTypeDto: UpdatePropertyTypeDto) {
    return `This action updates a #${id} propertyType`;
  }

  remove(id: number) {
    return `This action removes a #${id} propertyType`;
  }
}
