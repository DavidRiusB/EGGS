import { Test, TestingModule } from '@nestjs/testing';
import { RepairDetailsService } from './repair-details.service';

describe('RepairDetailsService', () => {
  let service: RepairDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepairDetailsService],
    }).compile();

    service = module.get<RepairDetailsService>(RepairDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
