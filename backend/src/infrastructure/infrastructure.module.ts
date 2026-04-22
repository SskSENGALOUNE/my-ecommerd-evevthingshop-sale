import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ExModuleInfrastructureModule } from './ex-module/ex-module-infrastructure.module';
import { TransactionInfrastructureModule } from './transaction/transaction-infrastructure.module';
import { AuthInfrastructureModule } from './auth/auth-infrastructure.module';

@Module({
  imports: [
    PrismaModule,
    ExModuleInfrastructureModule,
    TransactionInfrastructureModule,
    AuthInfrastructureModule,
  ],
  exports: [
    PrismaModule,
    ExModuleInfrastructureModule,
    TransactionInfrastructureModule,
    AuthInfrastructureModule,
  ],
})
export class InfrastructureModule {}
