import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './utilities/health-check/health.service';
import { DatabaseHealthService } from './utilities/health-check/database-health.service';
import { DbHealthResult } from './utilities/health-check/db-health-result';
import { Public } from './presentation/auth/decorators/public.decorator';

@ApiTags('health')
@Public()
@Controller('health')
export class AppController {
  constructor(
    private readonly healthService: HealthService,
    private readonly databaseHealthService: DatabaseHealthService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Basic health check endpoint' })
  async healthCheck(): Promise<{
    status: string;
    code: number;
    database: DbHealthResult[];
  }> {
    return {
      status: `Project Is Running V : ${this.healthService.getPackageVersion()}`,
      code: 200,
      database: await this.databaseHealthService.checkAll(),
    };
  }
}
