import { Test, TestingModule } from '@nestjs/testing';
import { ReversalsController } from './reversals.controller';

describe('ReversalsController', () => {
  let controller: ReversalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReversalsController],
    }).compile();

    controller = module.get<ReversalsController>(ReversalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
