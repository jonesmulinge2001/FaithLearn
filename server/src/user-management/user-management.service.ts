/* eslint-disable prettier/prettier */
 
 
 
 
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserManagementService {
    private prisma = new PrismaClient();
    constructor(){}

    // get all users
    async findAllUsers(): Promise<User[]> {
        try {
            const users = await this.prisma.user.findMany({
                orderBy: { id: 'asc'},
            });
            return users
        } catch (error) {
            throw new InternalServerErrorException('Error while fetching users');
        }
    }

    // find a single user by id
    async findUserById(id: string): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: id},
            });
            if(!user) {
                throw new NotFoundException(`User with ${id} not found`);
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException('Error while finding user');
        }
    }

    // delete a user(soft delete)
    async deleteUser(id: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: id },
            });
            if(!user) {
                throw new NotFoundException(`User with ${id} not found`);
            }
            await this.prisma.user.delete({
                where: {id},
            });
            return { message: 'User deleted successfully'};
        } catch (error) {
            throw new InternalServerErrorException('Error while deleting a user');
        }
    }

    // find user by email
    async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: email},
            });
            if(!user) {
                throw new NotFoundException(`User with email ${email} not found`);
            }
            return user
        } catch (error) {
            throw new InternalServerErrorException('Error while finding usre')
        }
    }
}
