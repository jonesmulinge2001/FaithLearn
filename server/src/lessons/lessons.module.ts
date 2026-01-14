/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PermissionModule } from '../permissions/permission.module';

@Module({
  imports: [PermissionModule],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
