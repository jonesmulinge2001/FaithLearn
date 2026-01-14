/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { AuthGuard } from '@nestjs/passport';
import { UserManagementService } from './user-management.service';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { RequirePermissions } from 'src/decorator/permission.decorator';
import { Permission } from 'src/permissions/permission.enums';
import { ApiResponse } from 'src/interfaces/apiResponse';
import { User } from 'src/interfaces/user.interface';

@Controller('admin/user')
export class UserManagementController {
  constructor(private readonly UsersService: UserManagementService) {}

  /**
   * @ Get() all users
   * @ returns user[]
   */
  @Get()
  // @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const users = await this.UsersService.findAllUsers();
      return {
        success: true,
        message: `${users.length} retrieved successfully`,
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  /**
   * @ Get() user by id
   * @ returns user
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  async getUserById(@Param('id') id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.UsersService.findUserById(id);
      return {
        success: true,
        message: `User with ${id} retrieved successfully`,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error instanceof Error ? error.message : 'Unknown errro',
        data: null,
      };
    }
  }

  /**
   * @ Get() user by email
   * @ return user
   */
  @Get('email/:email')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<ApiResponse<User>> {
    try {
      const user = await this.UsersService.findUserByEmail(email);
      return {
        success: true,
        message: `User with email ${email} retrieved successfully`,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  /**
   * @ Delete() user by id
   * @param id
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  async deleteUser(@Param('id') id: string): Promise<ApiResponse<void>> {
    try {
      return {
        success: true,
        message: `User with id ${id} deleted successfully`,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }
}
