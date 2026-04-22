import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { ADMIN_REPOSITORY, type IAdminRepository } from '../../../domain/admin/admin.repository';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ADMIN_SECRET as string,
    });
  }

  async validate(payload: { sub: string; email: string; role: string; type: string }) {
    if (payload.type !== 'admin') throw new UnauthorizedException();
    const admin = await this.adminRepository.findById(payload.sub);
    if (!admin || !admin.isActive) throw new UnauthorizedException();
    return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
  }
}
