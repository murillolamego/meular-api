import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq, getTableColumns } from 'drizzle-orm';
import {
  PropertyEntity,
  UnsafePropertyEntity,
} from './entities/property.entity';
import {
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common/exceptions';
import { JWTPayload } from '../common/strategies/accessToken.strategy';

// Only select SAFE columns, omit id, etc
const { id, createdAt, updatedAt, deletedAt, ...safePropertyCols } =
  getTableColumns(databaseSchema.properties);

export const safeProperty = safePropertyCols;

// Omit relations
type Property = Omit<CreatePropertyDto, 'types' | 'categories'> & {
  userId: string;
};

@Injectable()
export class PropertiesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(
    { sub }: JWTPayload,
    createPropertyDto: CreatePropertyDto,
  ): Promise<PropertyEntity> {
    try {
      const property: Property = {
        title: createPropertyDto.title,
        userId: sub,
      };

      let createdProperty: UnsafePropertyEntity[] = [];
      await this.drizzleService.db.transaction(async (tx) => {
        createdProperty = await tx
          .insert(databaseSchema.properties)
          .values(property)
          .returning();

        if (!createdProperty.length) {
          throw new ServiceUnavailableException();
        }

        for (const propertyTypeId of createPropertyDto.types) {
          await tx.insert(databaseSchema.propertiesToTypes).values({
            propertyId: createdProperty[0].id,
            typeId: propertyTypeId,
          });
        }

        for (const propertyCategoryId of createPropertyDto.categories) {
          await tx.insert(databaseSchema.propertiesToCategories).values({
            propertyId: createdProperty[0].id,
            categoryId: propertyCategoryId,
          });
        }
      });

      if (!createdProperty.length) {
        throw new ServiceUnavailableException();
      }

      return createdProperty[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new ServiceUnavailableException(
        'property creation on database failed',
      );
    }
  }

  async findAll(): Promise<PropertyEntity[]> {
    try {
      return await this.drizzleService.db
        .select(safeProperty)
        .from(databaseSchema.properties);
    } catch (error) {
      throw new ServiceUnavailableException(
        'fetching properties from database failed',
      );
    }
  }

  async findAllByUserId(userId: string): Promise<PropertyEntity[]> {
    try {
      return await this.drizzleService.db
        .select(safeProperty)
        .from(databaseSchema.properties)
        .where(eq(databaseSchema.properties.userId, userId));
    } catch (error) {
      throw new ServiceUnavailableException(
        `fetching properties of user id ${userId} from database failed`,
      );
    }
  }

  async findOne(id: string): Promise<PropertyEntity> {
    try {
      const properties: PropertyEntity[] = await this.drizzleService.db
        .select(safeProperty)
        .from(databaseSchema.properties)
        .where(eq(databaseSchema.properties.publicId, id))
        .limit(1);
      if (!properties.length) {
        throw new NotFoundException();
      }
      return properties[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`property with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `fetching property with id ${id} from database failed`,
      );
    }
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<PropertyEntity> {
    try {
      const updatedPropertys = await this.drizzleService.db
        .update(databaseSchema.properties)
        .set(updatePropertyDto)
        .where(eq(databaseSchema.properties.publicId, id))
        .returning(safeProperty);

      if (!updatedPropertys.length) {
        throw new NotFoundException();
      }
      return updatedPropertys[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`property with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `updating property with id ${id} on database failed, params: ${updatePropertyDto}`,
      );
    }
  }

  async remove(id: string): Promise<PropertyEntity> {
    try {
      const deletedPropertys = await this.drizzleService.db
        .delete(databaseSchema.properties)
        .where(eq(databaseSchema.properties.publicId, id))
        .returning(safeProperty);

      if (!deletedPropertys.length) {
        throw new NotFoundException();
      }

      return deletedPropertys[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`property with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `removing property with id ${id} on database failed`,
      );
    }
  }
}
