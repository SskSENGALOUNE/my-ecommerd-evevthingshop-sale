import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAdminRepository } from '../../../domain/admin/admin.repository';
import { Admin, AdminRole } from '../../../domain/admin/admin.entity';
import { AdminRole as PrismaAdminRole } from '@prisma/client';

function mapRole(role: PrismaAdminRole): AdminRole {
  return role === PrismaAdminRole.SUPER_ADMIN ? AdminRole.SUPER_ADMIN : AdminRole.ADMIN;
}

@Injectable()
export class AdminRepositoryImpl implements IAdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Admin | null> {
    const result = await this.prisma.admin.findUnique({ where: { email } });
    if (!result) return null;
    return new Admin(result.id, result.email, result.password, result.name, mapRole(result.role), result.isActive, result.createdAt, result.updatedAt);
  }

  async findById(id: string): Promise<Admin | null> {
    const result = await this.prisma.admin.findUnique({ where: { id } });
    if (!result) return null;
    return new Admin(result.id, result.email, result.password, result.name, mapRole(result.role), result.isActive, result.createdAt, result.updatedAt);
  }
}
