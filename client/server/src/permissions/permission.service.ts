/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { Permission } from './permission.enums';

@Injectable()
export class PermissionService {
    private readonly rolePermissions: Record<UserRole, Permission[]> = {
        ADMIN: [
            Permission.MANAGE_LESSONS,
            Permission.MANAGE_USERS,
            Permission.VIEW_USERS,
         
          ],
          LEARNER: [
            Permission.COMPLETE_LESSON,
            Permission.ASK_QUESTION
          ]
    };

    getRolePermissions(role: UserRole): Permission[] {
        return this.rolePermissions[role] || [];
    }
    hasPermission(role: UserRole, permission: Permission): boolean {
        return this.getRolePermissions(role).includes(permission);
    }
}
