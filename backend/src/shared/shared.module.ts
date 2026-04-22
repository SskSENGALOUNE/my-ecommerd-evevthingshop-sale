import { Global, Module } from '@nestjs/common';
import { EX_TABLE_REPOSITORY } from '../domain/ex-module/ex-table.repository';
import { ExTableRepositoryImpl } from '../infrastructure/prisma/repositories/ex-table.repository.impl';
import { ADMIN_REPOSITORY } from '../domain/admin/admin.repository';
import { AdminRepositoryImpl } from '../infrastructure/prisma/repositories/admin.repository.impl';
import { CUSTOMER_REPOSITORY } from '../domain/customer/customer.repository';
import { CustomerRepositoryImpl } from '../infrastructure/prisma/repositories/customer.repository.impl';

@Global()
@Module({
  providers: [
    { provide: EX_TABLE_REPOSITORY, useClass: ExTableRepositoryImpl },
    { provide: ADMIN_REPOSITORY, useClass: AdminRepositoryImpl },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepositoryImpl },
  ],
  exports: [EX_TABLE_REPOSITORY, ADMIN_REPOSITORY, CUSTOMER_REPOSITORY],
})
export class SharedModule {}
