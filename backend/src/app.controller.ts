import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './utilities/health-check/health.service';
import { Public } from './presentation/auth/decorators/public.decorator';

@ApiTags('health')
@Public()
@Controller('health')
export class AppController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check endpoint' })
  healthCheck(): { status: string; code: number } {
    return {
      status: `Project Is Running V : ${this.healthService.getPackageVersion()}`,
      code: 200,
    };
  }
}
