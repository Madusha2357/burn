import { Test, TestingModule } from '@nestjs/testing';
import { QuizResponseService } from '../services/quiz-response.service';
import { QuizResponseController } from './quiz-response.controller';

describe('QuizResponseController', () => {
  let controller: QuizResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizResponseController],
      providers: [QuizResponseService],
    }).compile();

    controller = module.get<QuizResponseController>(QuizResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
