import {
  Injectable,
  ServiceUnavailableException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { dbConstraintFail } from '../utils/dbContraint/dbConstraint';
import { eq } from 'drizzle-orm';
import { createSlug } from '../utils/slug/slug';

type PropertyType = CreatePropertyTypeDto & { slug: string };

@Injectable()
export class PropertyTypesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createPropertyTypeDto: CreatePropertyTypeDto) {
    try {
      const propertyType: PropertyType = {
        name: createPropertyTypeDto.name,
        slug: createSlug(createPropertyTypeDto.name),
      };

      const createdPropertyType = await this.drizzleService.db
        .insert(databaseSchema.propertyTypes)
        .values(propertyType)
        .returning();

      return createdPropertyType[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(dbConstraintFail(error.constraint));
      }
      throw new ServiceUnavailableException(
        'property type creation on database failed',
      );
    }
  }

  async findAll() {
    try {
      return await this.drizzleService.db
        .select()
        .from(databaseSchema.propertyTypes);
    } catch (error) {
      throw new ServiceUnavailableException(
        'fetching property types from database failed',
      );
    }
  }

  async findOne(id: number) {
    try {
      const propertyTypes = await this.drizzleService.db
        .select()
        .from(databaseSchema.propertyTypes)
        .where(eq(databaseSchema.propertyTypes.id, id))
        .limit(1);
      if (!propertyTypes.length) {
        throw new NotFoundException();
      }
      return propertyTypes[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`property type with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `fetching property type with id ${id} from database failed`,
      );
    }
  }

  async update(id: number, updatePropertyTypeDto: UpdatePropertyTypeDto) {
    try {
      const propertyType: PropertyType = {
        name: updatePropertyTypeDto.name,
        slug: createSlug(updatePropertyTypeDto.name),
      };

      const updatedPropertyTypes = await this.drizzleService.db
        .update(databaseSchema.propertyTypes)
        .set(propertyType)
        .where(eq(databaseSchema.propertyTypes.id, id))
        .returning();

      if (!updatedPropertyTypes.length) {
        throw new NotFoundException();
      }
      return updatedPropertyTypes[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`property type with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `updating property type with id ${id} on database failed, params: ${updatePropertyTypeDto}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const deletedPropertyTypes = await this.drizzleService.db
        .delete(databaseSchema.propertyTypes)
        .where(eq(databaseSchema.propertyTypes.id, id))
        .returning();

      if (!deletedPropertyTypes.length) {
        throw new NotFoundException();
      }

      return deletedPropertyTypes[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`property type with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `removing property type with id ${id} on database failed`,
      );
    }
  }
}
