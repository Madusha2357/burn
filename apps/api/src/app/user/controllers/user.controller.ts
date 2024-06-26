import {
  applyDefaultPage,
  AuthorizedRequest,
  ChangePasswordDto,
  DefaultQueryParams,
  Role,
  UpdateUserDto,
  URL_ATTEMP,
  URL_CHANGE_PASSWORD,
  URL_DOWNLOAD,
  URL_USER,
} from '@damen/models';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  StreamableFile,
} from '@nestjs/common';
import { Roles } from '../../auth/roles/role.decorator';
import { CreateUserDto } from '../models/user.dto';
import { UserService } from '../services/user.service';
import { IUserController } from './user-controller.interface';
import { UserEmailService } from '../services/user-email.service';
import { SkipThrottle } from '@nestjs/throttler';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Public } from '../../auth/auth.metadata';

@Controller(`${URL_USER}`)
export class UserController implements IUserController {
  constructor(
    private readonly userService: UserService,
    private readonly userEmailService: UserEmailService
  ) {}

  @SkipThrottle()
  @Post()
  // @Roles(Role.ADMIN)
  @Public()
  create(@Body() dto: CreateUserDto, @Req() req: AuthorizedRequest) {
    return this.userService.create(dto);
  }

  @SkipThrottle()
  @Post(':id/send/invitation')
  @Roles(Role.ADMIN)
  @Public()
  sendInvitationEmail(@Param('id') id: string) {
    return this.userEmailService.sendInvitationEmail(id);
  }

  @SkipThrottle()
  @Get()
  @Roles(Role.ADMIN)
  @Public()
  findAll(@Query() query: DefaultQueryParams) {
    query = applyDefaultPage(query);
    return this.userService.findAll(query);
  }

  @SkipThrottle()
  @Get('filter')
  @Roles(Role.ADMIN)
  @Public()
  findAllWithFIlter(@Query() query: DefaultQueryParams) {
    query = applyDefaultPage(query);
    return this.userService.findAllWithFilter(query);
  }

  @Get(':id')
  @SkipThrottle()
  // @Roles(Role.ADMIN, Role.USER)
  @Public()
  findOne(@Param('id') id: string, @Req() req: AuthorizedRequest) {
    return this.userService.findOne(id);
  }

  @SkipThrottle()
  @Patch(':id')
  @Public()
  // @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthorizedRequest
  ) {
    console.log('id', id);

    return this.userService.update(id, dto, req.user);
  }

  @SkipThrottle()
  @Patch('delete/:id')
  @Public()
  @Roles(Role.ADMIN, Role.USER)
  delete(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthorizedRequest
  ) {
    return this.userService.softDelete(id);
  }

  @Post(`${URL_CHANGE_PASSWORD}`)
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(200)
  @Public()
  changePassword(
    @Body() credentials: ChangePasswordDto,
    @Req() req: AuthorizedRequest
  ) {
    return this.userService.changePassword(credentials, req.user);
  }

  @Post(`${URL_DOWNLOAD}`)
  @Roles(Role.ADMIN)
  @Public()
  async downloadCsv(
    @Query() query: DefaultQueryParams
  ): Promise<StreamableFile> {
    await this.userService.downloadCsv(query.quizId);
    const file = createReadStream(join(process.cwd(), 'temp.csv'));
    return new StreamableFile(file);
  }

  @Post(`${URL_ATTEMP}/:id`)
  @Public()
  quizAttempCheck(@Param('id') id: string) {
    return this.userService.quizAttempCheck(id);
  }

  @SkipThrottle()
  @Get('quiz/filter')
  @Public()
  @Roles(Role.ADMIN)
  getUsersByQuiz(@Query() query: DefaultQueryParams) {
    query = applyDefaultPage(query);
    return this.userService.getUsersByQuiz(query);
  }

  @SkipThrottle()
  @Get('map-data/hospitals')
  // @Roles(Role.USER)
  @Public()
  getHospitals(@Query() query: DefaultQueryParams) {
    query = applyDefaultPage(query);
    return this.userService.getHospitals(query);
  }

  @SkipThrottle()
  @Get('map-data/doctors')
  // @Roles(Role.USER)
  @Public()
  getDoctors(@Query() query: DefaultQueryParams) {
    query = applyDefaultPage(query);
    return this.userService.getDoctors(query);
  }

  @SkipThrottle()
  @Patch('All/All')
  @Public()
  updateAll(@Body() dto: UpdateUserDto, @Req() req: AuthorizedRequest) {
    return this.userService.updateAll(dto);
  }
}
