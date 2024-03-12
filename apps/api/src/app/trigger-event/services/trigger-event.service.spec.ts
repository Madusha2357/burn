import { Test, TestingModule } from '@nestjs/testing';
import { TriggerEventService } from './trigger-event.service';

describe('TriggerEventService', () => {
  let service: TriggerEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TriggerEventService],
    }).compile();

    service = module.get<TriggerEventService>(TriggerEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
