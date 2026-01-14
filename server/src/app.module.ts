/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LessonsModule } from './lessons/lessons.module';
import { UsersManagementModule } from './user-management/user-management.module';

@Module({
  imports: [AuthModule, LessonsModule, UsersManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
