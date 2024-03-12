import {
  applyDefaultPageWithQuiz,
  AuthorizedRequest,
  BufferedFile,
  DefaultQueryParamsWithQuiz,
  IUpdateQuestionDto,
  Role,
  URL_PATH_FIND_QUIZ_ID,
  URL_PATH_QUESTION_BY_QUIZ_ID,
  URL_QUESTION,
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../auth/roles/role.decorator';
import { CreateQuestionDto } from '../models/question.dto';
import { QuestionService } from '../services/question.service';
import { IQuestionController } from './question-controller.interface';
import { SkipThrottle } from '@nestjs/throttler';

@Controller(`${URL_QUESTION}`)
export class QuestionController implements IQuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @SkipThrottle()
  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Req() req: AuthorizedRequest
  ) {
    return this.questionService.create(createQuestionDto, req.user);
  }

  @SkipThrottle()
  @Post('image')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image: BufferedFile) {
    return this.questionService.uploadImage(image);
  }

  @SkipThrottle()
  @Get()
  @Roles(Role.ADMIN, Role.USER)
  findAll(
    @Query()
    query: DefaultQueryParamsWithQuiz
  ) {
    query = applyDefaultPageWithQuiz(query);
    return this.questionService.findAll(query);
  }

  @SkipThrottle()
  @Get(`${URL_PATH_FIND_QUIZ_ID}`)
  @Roles(Role.ADMIN, Role.USER)
  findById(
    @Query()
    query: DefaultQueryParamsWithQuiz
  ) {
    query = applyDefaultPageWithQuiz(query);
    return this.questionService.findById(query);
  }

  @SkipThrottle()
  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @SkipThrottle()
  @Get(`${URL_PATH_QUESTION_BY_QUIZ_ID}/:id`)
  @Roles(Role.ADMIN, Role.USER)
  findByOrder(@Param('id') id: string, @Query() { displayOrder = 1 }) {
    return this.questionService.findByOrder(id, displayOrder);
  }

  @SkipThrottle()
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: IUpdateQuestionDto,
    @Req() req: AuthorizedRequest
  ) {
    return this.questionService.update(id, updateQuestionDto, req.user);
  }
}
