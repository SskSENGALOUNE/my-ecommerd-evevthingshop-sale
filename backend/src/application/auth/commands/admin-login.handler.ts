import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminLoginCommand } from './admin-login.command';
import { ADMIN_REPOSITORY, type IAdminRepository } from '../../../domain/admin/admin.repository';

export interface AdminLoginResult {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@CommandHandler(AdminLoginCommand)
export class AdminLoginHandler implements ICommandHandler<AdminLoginCommand> {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
    @Inject('JWT_ADMIN_SERVICE')
    private readonly jwtService: JwtService,
  ) { }

  async execute(command: AdminLoginCommand): Promise<AdminLoginResult> {
    const admin = await this.adminRepository.findByEmail(command.email);
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(command.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email, role: admin.role, type: 'admin' };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }
}
