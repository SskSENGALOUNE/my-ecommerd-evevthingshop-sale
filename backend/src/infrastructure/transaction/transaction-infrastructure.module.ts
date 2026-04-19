import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionRepository } from '../prisma/repositories/transaction.repository';
import { TRANSECTION_REPOSITORY } from '../../domain/transaction/transaction.repository';

@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: TRANSECTION_REPOSITORY,
            useClass: TransactionRepository,
        },
    ],
    exports: [TRANSECTION_REPOSITORY],
})
export class TransactionInfrastructureModule { }
