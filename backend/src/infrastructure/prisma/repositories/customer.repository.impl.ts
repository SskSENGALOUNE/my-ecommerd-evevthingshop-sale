import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ICustomerRepository, CreateCustomerData } from '../../../domain/customer/customer.repository';
import { Customer } from '../../../domain/customer/customer.entity';

@Injectable()
export class CustomerRepositoryImpl implements ICustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  private map(result: any): Customer {
    return new Customer(result.id, result.email, result.password, result.name, result.phone, result.isActive, result.createdAt, result.updatedAt);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const result = await this.prisma.customer.findUnique({ where: { email } });
    return result ? this.map(result) : null;
  }

  async findById(id: string): Promise<Customer | null> {
    const result = await this.prisma.customer.findUnique({ where: { id } });
    return result ? this.map(result) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.customer.count({ where: { email } });
    return count > 0;
  }

  async create(data: CreateCustomerData): Promise<Customer> {
    const result = await this.prisma.customer.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
      },
    });
    return this.map(result);
  }
}
