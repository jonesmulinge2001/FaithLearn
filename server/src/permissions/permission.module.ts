/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionGuard } from '../guards/permissions.guard';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService,  PermissionGuard],
  exports: [PermissionService, PermissionGuard],
})
export class PermissionModule {}
