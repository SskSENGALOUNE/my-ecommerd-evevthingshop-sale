import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ColorController } from "./color.controller";
import { ColorRepositoryImpl } from "../../infrastructure/prisma/repositories/color.repository.impl";
import { COLOR_REPOSITORY } from "../../domain/color/color.repository";
import { ApplicationModule } from "../../application/application.module";
import { PrismaModule } from "../../infrastructure/prisma/prisma.module";
import {
  CreateColorHandler,
  UpdateColorHandler,
  DeleteColorHandler,
} from "../../application/color/commands";
import {
  GetAllColorsHandler,
  GetColorByIdHandler,
} from "../../application/color/queries";

const commandHandlers = [
  CreateColorHandler,
  UpdateColorHandler,
  DeleteColorHandler,
];
const queryHandlers = [GetAllColorsHandler, GetColorByIdHandler];

@Module({
  imports: [CqrsModule, ApplicationModule, PrismaModule],
  controllers: [ColorController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    {
      provide: COLOR_REPOSITORY,
      useClass: ColorRepositoryImpl,
    },
  ],
})
export class ColorModule {}
