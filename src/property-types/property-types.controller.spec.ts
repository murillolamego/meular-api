import { Test, TestingModule } from '@nestjs/testing';
import { PropertyTypesController } from './property-types.controller';
import { PropertyTypesService } from './property-types.service';

describe('PropertyTypesController', () => {
  let controller: PropertyTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyTypesController],
      providers: [PropertyTypesService],
    }).compile();

    controller = module.get<PropertyTypesController>(PropertyTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
