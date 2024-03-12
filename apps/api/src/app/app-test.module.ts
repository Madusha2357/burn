import { Module } from '@nestjs/common';
import { IMPORTS } from './app.module.utils';

@Module({
  imports: [...IMPORTS],
})
export class AppTestModule {}
