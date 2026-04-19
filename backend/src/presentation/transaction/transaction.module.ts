import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionController } from './transaction.controller';
import { TransactionApplicationModule } from '../../application/transaction/transaction-application.module';
import { TransactionInfrastructureModule } from '../../infrastructure/transaction/transaction-infrastructure.module';

@Module({
    imports: [
        CqrsModule,
        TransactionApplicationModule,
        TransactionInfrastructureModule,
    ],
    controllers: [TransactionController],
})
export class TransactionModule { }
