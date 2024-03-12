import {
  applyDefaultPage,
  applyDefaultPageWithUserId,
  AuthorizedRequest,
  DefaultQueryParams,
  DefaultQueryParamsWithUserId,
  ProjectionQuizResponseOverview,
  Role,
  UpdateQuizResponseDto,
  URL_DOWNLOAD,
  URL_PATH_APPEND,
  URL_PATH_BY_KEY,
  URL_PATH_QUIZZES_BY_USER,
  URL_PATH_RESULTS,
  URL_PUBLIC,
  URL_QUIZ_RESPONSE,
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
  StreamableFile,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from '../../auth/roles/role.decorator';
import { QuizFindAllPromise } from '../../quiz/types/quiz.types';
import {
  CreatePublicQuizResponseDto,
  CreateQuizResponseDto,
  QuizResponseResultDto,
} from '../models/quiz-response.dto';
import { QuizResponseDocument } from '../schema/quiz-response.schema';
import { QuizResponseService } from '../services/quiz-response.service';
import { QuizResponseFindAllPromise } from '../types/quiz-response.types';
import { IQuizResponseController } from './quiz-response-controller.interface';
import { Public } from '../../auth/auth.metadata';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller(`${URL_QUIZ_RESPONSE}`)
export class QuizResponseController implements IQuizResponseController {
  constructor(private readonly quizResponseService: QuizResponseService) {}

  @Post(URL_PUBLIC)
  @Public()
  public(@Body() dto: CreatePublicQuizResponseDto) {
    return this.quizResponseService.public(dto);
  }

  @Post()
  @Roles(Role.USER)
  create(
    @Body() dto: CreateQuizResponseDto,
    @Req() req: AuthorizedRequest
  ): Promise<QuizResponseDocument> {
    return this.quizResponseService.create(dto, req.user);
  }

  @SkipThrottle()
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query() query: DefaultQueryParams): QuizResponseFindAllPromise {
    query = applyDefaultPage(query);
    return this.quizResponseService.findAll(query);
  }

  @SkipThrottle()
  @Get(`/${URL_PATH_BY_KEY}`)
  @Roles(Role.ADMIN, Role.USER)
  findOneByKey(
    @Query()
    { quizId = '', userId = '' }
  ): Promise<ProjectionQuizResponseOverview> {
    return this.quizResponseService.findOneByKey(quizId, userId);
  }

  @SkipThrottle()
  @Get(`/${URL_PATH_RESULTS}`)
  @Roles(Role.ADMIN, Role.USER)
  findResultsByQuizId(
    @Query()
    { quizId = '' }
  ): any {
    return this.quizResponseService.findResultsByQuizId(quizId);
  }

  @SkipThrottle()
  @Get(`/${URL_PATH_QUIZZES_BY_USER}`)
  @Roles(Role.ADMIN, Role.USER)
  findQuizzesByUser(
    @Query() query: DefaultQueryParamsWithUserId
  ): QuizFindAllPromise {
    query = applyDefaultPageWithUserId(query);
    return this.quizResponseService.quizzesByUserId(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  findOne(@Param('id') id: string) {
    return this.quizResponseService.findOne(id);
  }

  @SkipThrottle()
  @Patch(':id')
  @Roles(Role.USER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuizResponseDto,
    @Req() req: AuthorizedRequest
  ) {
    return this.quizResponseService.update(id, dto, req.user);
  }

  @SkipThrottle()
  @Patch(`/${URL_PATH_APPEND}/:id`)
  append(
    @Param('id') id: string,
    @Body() quizResponseDto: QuizResponseResultDto
  ) {
    return this.quizResponseService.append(id, quizResponseDto);
  }

  @SkipThrottle()
  @Post(`${URL_DOWNLOAD}/:id`)
  @Roles(Role.ADMIN)
  async downloadCsv(@Param('id') quizId: string): Promise<StreamableFile> {
    await this.quizResponseService.downloadQuizResponse(quizId);
    const file = createReadStream(join(process.cwd(), 'temp.csv'));
    return new StreamableFile(file);
  }
}
