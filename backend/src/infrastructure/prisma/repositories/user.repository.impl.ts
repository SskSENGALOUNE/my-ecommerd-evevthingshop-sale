import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IUserRepository,
  CreateUserData,
  UserData,
} from '../../../domain/user/user.repository';
import { UserRole } from '../../../domain/user/user.entity';
import { Role } from '@prisma/client';

function mapPrismaRole(role: Role): UserRole {
  return role === Role.ADMIN ? UserRole.ADMIN : UserRole.USER;
}

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<UserData> {
    const result = await this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        role: data.role as Role,
      },
    });

    return {
      id: result.id,
      username: result.username,
      password: result.password,
      role: mapPrismaRole(result.role),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByUsername(username: string): Promise<UserData | null> {
    const result = await this.prisma.user.findUnique({ where: { username } });
    if (!result) return null;

    return {
      id: result.id,
      username: result.username,
      password: result.password,
      role: mapPrismaRole(result.role),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findById(id: string): Promise<UserData | null> {
    const result = await this.prisma.user.findUnique({ where: { id } });
    if (!result) return null;

    return {
      id: result.id,
      username: result.username,
      password: result.password,
      role: mapPrismaRole(result.role),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { username } });
    return count > 0;
  }
}
