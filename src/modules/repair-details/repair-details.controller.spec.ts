import { Test, TestingModule } from '@nestjs/testing';
import { RepairDetailsController } from './repair-details.controller';

describe('RepairDetailsController', () => {
  let controller: RepairDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairDetailsController],
    }).compile();

    controller = module.get<RepairDetailsController>(RepairDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
