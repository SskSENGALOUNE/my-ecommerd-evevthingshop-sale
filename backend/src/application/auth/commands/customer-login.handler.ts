import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomerLoginCommand } from './customer-login.command';
import { CUSTOMER_REPOSITORY, type ICustomerRepository } from '../../../domain/customer/customer.repository';

export interface CustomerLoginResult {
  accessToken: string;
  customer: {
    id: string;
    email: string;
    name: string;
  };
}

@CommandHandler(CustomerLoginCommand)
export class CustomerLoginHandler implements ICommandHandler<CustomerLoginCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject('JWT_CUSTOMER_SERVICE')
    private readonly jwtService: JwtService,
  ) { }

  async execute(command: CustomerLoginCommand): Promise<CustomerLoginResult> {
    const customer = await this.customerRepository.findByEmail(command.email);
    if (!customer || !customer.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(command.password, customer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: customer.id, email: customer.email, type: 'customer' };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    };
  }
}
