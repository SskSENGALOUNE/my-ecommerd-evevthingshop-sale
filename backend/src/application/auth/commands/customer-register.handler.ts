import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CustomerRegisterCommand } from './customer-register.command';
import { CUSTOMER_REPOSITORY, type ICustomerRepository } from '../../../domain/customer/customer.repository';

export interface CustomerRegisterResult {
  id: string;
  email: string;
  name: string;
}

@CommandHandler(CustomerRegisterCommand)
export class CustomerRegisterHandler implements ICommandHandler<CustomerRegisterCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) { }

  async execute(command: CustomerRegisterCommand): Promise<CustomerRegisterResult> {
    const exists = await this.customerRepository.existsByEmail(command.email);
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);
    const customer = await this.customerRepository.create({
      email: command.email,
      password: hashedPassword,
      name: command.name,
      phone: command.phone,
    });

    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
    };
  }
}
