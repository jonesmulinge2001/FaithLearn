/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PermissionModule } from '../permissions/permission.module';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';

@Module({
  imports: [PermissionModule],
  controllers: [UserManagementController],
  providers: [UserManagementService],
  exports: [UserManagementService],
})
export class UsersManagementModule {}
