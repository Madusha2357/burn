import {
  applyDefaultPage,
  AuthorizedRequest,
  DefaultQueryParams,
  ProjectionQuizDataTable,
  Role,
  UpdateQuizDto,
  URL_PATH_ACTIVE,
  URL_PATH_VALIDATE,
  URL_QUIZ,
  URL_QUIZ_PATH_GET,
} from '@damen/models';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from '../../auth/roles/role.decorator';
import { CreateQuizDto } from '../models/quiz.dto';
import { QuizDocument } from '../schema/quiz.schema';
import { QuizService } from '../services/quiz.service';
import { IQuizController } from './quiz-controller.interface';
import { Public } from '../../auth/auth.metadata';

@Controller(`${URL_QUIZ}`)
export class QuizController implements IQuizController {
  constructor(private readonly quizService: QuizService) {}

  @SkipThrottle()
  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() dto: CreateQuizDto,
    @Req() req: AuthorizedRequest
  ): Promise<QuizDocument> {
    return this.quizService.create(dto, req.user);
  }

  @SkipThrottle()
  @Post(`/${URL_QUIZ_PATH_GET}`)
  @Roles(Role.ADMIN)
  findAll(
    @Query()
    query: DefaultQueryParams,
    @Body() dto: ProjectionQuizDataTable
  ) {
    query = applyDefaultPage(query);
    return this.quizService.findAll(query, dto);
  }

  @Get(`${URL_PATH_ACTIVE}`)
  // @Roles(Role.ADMIN, Role.USER)
  @Public()
  findActive(): Promise<QuizDocument> {
    return this.quizService.findActive();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  findOne(@Param('id') id: string): Promise<QuizDocument> {
    return this.quizService.findOne(id);
  }

  @SkipThrottle()
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @Req() req: AuthorizedRequest
  ): Promise<QuizDocument> {
    return this.quizService.update(id, updateQuizDto, req.user);
  }

  @SkipThrottle()
  @Get(`${URL_PATH_VALIDATE}/:id`)
  @Roles(Role.ADMIN, Role.USER)
  validate(@Param('id') id: string): Promise<QuizDocument> {
    return this.quizService.validate(id);
  }
}
