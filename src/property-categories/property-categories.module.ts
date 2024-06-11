import { Module } from '@nestjs/common';
import { PropertyCategoriesService } from './property-categories.service';
import { PropertyCategoriesController } from './property-categories.controller';

@Module({
  controllers: [PropertyCategoriesController],
  providers: [PropertyCategoriesService],
})
export class PropertyCategoriesModule {}
