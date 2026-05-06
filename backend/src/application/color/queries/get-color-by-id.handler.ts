import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetColorByIdQuery } from './get-color-by-id.query';
import * as colorRepository from '../../../domain/color/color.repository';

@QueryHandler(GetColorByIdQuery)
export class GetColorByIdHandler implements IQueryHandler<GetColorByIdQuery> {
  constructor(
    @Inject(colorRepository.COLOR_REPOSITORY)
    private readonly repository: colorRepository.IColorRepository,
  ) {}

  async execute(query: GetColorByIdQuery): Promise<colorRepository.ColorData> {
    const color = await this.repository.findById(query.id);
    if (!color) {
      throw new NotFoundException('Color not found');
    }
    return color;
  }
}
