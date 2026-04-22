import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { CUSTOMER_REPOSITORY, type ICustomerRepository } from '../../../domain/customer/customer.repository';

@Injectable()
export class JwtCustomerStrategy extends PassportStrategy(Strategy, 'jwt-customer') {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_CUSTOMER_SECRET as string,
    });
  }

  async validate(payload: { sub: string; email: string; type: string }) {
    if (payload.type !== 'customer') throw new UnauthorizedException();
    const customer = await this.customerRepository.findById(payload.sub);
    if (!customer || !customer.isActive) throw new UnauthorizedException();
    return { id: customer.id, email: customer.email, name: customer.name };
  }
}
