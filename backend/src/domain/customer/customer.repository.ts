import { Customer } from './customer.entity';

export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';

export interface CreateCustomerData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface ICustomerRepository {
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
  existsByEmail(email: string): Promise<boolean>;
  create(data: CreateCustomerData): Promise<Customer>;
}
