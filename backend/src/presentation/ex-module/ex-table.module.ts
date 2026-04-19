import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ExTableController } from './ex-table.controller';
import { ApplicationModule } from '../../application/application.module';
import {
  CreateExTableHandler,
  UpdateExTableHandler,
  DeleteExTableHandler,
} from '../../application/ex-module/commands';
import {
  GetExTableByIdHandler,
  GetAllExTablesHandler,
} from '../../application/ex-module/queries';

const CommandHandlers = [
  CreateExTableHandler,
  UpdateExTableHandler,
  DeleteExTableHandler,
];

const QueryHandlers = [GetExTableByIdHandler, GetAllExTablesHandler];

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [ExTableController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ExTableModule {}
