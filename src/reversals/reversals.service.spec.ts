import { Test, TestingModule } from '@nestjs/testing';
import { ReversalsService } from './reversals.service';

describe('ReversalsService', () => {
  let service: ReversalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReversalsService],
    }).compile();

    service = module.get<ReversalsService>(ReversalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
