import { Module } from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';
import { PropertyTypesController } from './property-types.controller';

@Module({
  controllers: [PropertyTypesController],
  providers: [PropertyTypesService],
})
export class PropertyTypesModule {}
