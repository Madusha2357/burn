import { Test, TestingModule } from '@nestjs/testing';
import { TriggerEventService } from '../services/trigger-event.service';
import { TriggerEventController } from './trigger-event.controller';

describe('TriggerEventController', () => {
  let controller: TriggerEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TriggerEventController],
      providers: [TriggerEventService],
    }).compile();

    controller = module.get<TriggerEventController>(TriggerEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
