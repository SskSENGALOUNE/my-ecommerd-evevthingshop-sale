import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateColorHandler,
  UpdateColorHandler,
  DeleteColorHandler,
} from './commands';
import {
  GetAllColorsHandler,
  GetColorByIdHandler,
} from './queries';

const commandHandlers = [
  CreateColorHandler,
  UpdateColorHandler,
  DeleteColorHandler,
];
const queryHandlers = [GetAllColorsHandler, GetColorByIdHandler];

@Module({
  imports: [CqrsModule],
  providers: [...commandHandlers, ...queryHandlers],
})
export class ColorApplicationModule {}
