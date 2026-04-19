import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetTotalTransactionQuery } from '../../application/transaction/queries/get-total-transaction.query';
import { GetTransactionsPaginatedQuery } from '../../application/transaction/queries/get-transactions-paginated.query';
import { GetTotalTransactionResponseDto } from './dto/get-total-transaction-response.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly queryBus: QueryBus) { }

    @Get('summary')
    @ApiOperation({ summary: 'Get total transaction summary' })
    @ApiResponse({
        status: 200,
        description: 'Returns transaction summary with charts and notifications',
    })
    async getTotalTransaction(): Promise<GetTotalTransactionResponseDto> {
        return this.queryBus.execute(new GetTotalTransactionQuery());
    }

    @Get()
    @ApiOperation({ summary: 'Get paginated transactions' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status (PENDING, COMPLETED, FAILED)' })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of transactions',
    })
    async getTransactionsPaginated(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string,
    ) {
        return this.queryBus.execute(
            new GetTransactionsPaginatedQuery(
                page ? parseInt(page, 10) : 1,
                limit ? parseInt(limit, 10) : 10,
                status,
            ),
        );
    }
}
