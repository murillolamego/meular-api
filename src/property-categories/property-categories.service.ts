import {
  Injectable,
  ServiceUnavailableException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';
import { databaseSchema } from '../database/database-schema';
import { DrizzleService } from '../database/drizzle.service';
import { eq } from 'drizzle-orm';
import { createSlug } from '../utils/slug/slug';

type PropertyCategory = CreatePropertyCategoryDto & { slug: string };

@Injectable()
export class PropertyCategoriesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createPropertyCategoryDto: CreatePropertyCategoryDto) {
    try {
      const propertyCategory: PropertyCategory = {
        name: createPropertyCategoryDto.name,
        slug: createSlug(createPropertyCategoryDto.name),
      };

      const createdPropertyCategory = await this.drizzleService.db
        .insert(databaseSchema.propertyCategories)
        .values(propertyCategory)
        .returning();

      return createdPropertyCategory[0];
    } catch (error) {
      throw new ServiceUnavailableException(
        'property type creation on database failed',
      );
    }
  }

  async findAll() {
    try {
      return await this.drizzleService.db
        .select()
        .from(databaseSchema.propertyCategories);
    } catch (error) {
      throw new ServiceUnavailableException(
        'fetching property types from database failed',
      );
    }
  }

  async findOne(id: number) {
    try {
      const propertyCategories = await this.drizzleService.db
        .select()
        .from(databaseSchema.propertyCategories)
        .where(eq(databaseSchema.propertyCategories.id, id))
        .limit(1);
      if (!propertyCategories.length) {
        throw new NotFoundException();
      }
      return propertyCategories[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`property type with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `fetching property type with id ${id} from database failed`,
      );
    }
  }

  async update(
    id: number,
    updatePropertyCategoryDto: UpdatePropertyCategoryDto,
  ) {
    try {
      const propertyCategory: PropertyCategory = {
        name: updatePropertyCategoryDto.name,
        slug: createSlug(updatePropertyCategoryDto.name),
      };

      const updatedPropertyCategories = await this.drizzleService.db
        .update(databaseSchema.propertyCategories)
        .set(propertyCategory)
        .where(eq(databaseSchema.propertyCategories.id, id))
        .returning();

      if (!updatedPropertyCategories.length) {
        throw new NotFoundException();
      }
      return updatedPropertyCategories[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`property type with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `updating property type with id ${id} on database failed, params: ${updatePropertyCategoryDto}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const deletedPropertyCategories = await this.drizzleService.db
        .delete(databaseSchema.propertyCategories)
        .where(eq(databaseSchema.propertyCategories.id, id))
        .returning();

      if (!deletedPropertyCategories.length) {
        throw new NotFoundException();
      }

      return deletedPropertyCategories[0];
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
