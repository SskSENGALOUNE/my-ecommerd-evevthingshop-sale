import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllColorsQuery } from './get-all-colors.query';
import * as colorRepository from '../../../domain/color/color.repository';

@QueryHandler(GetAllColorsQuery)
export class GetAllColorsHandler implements IQueryHandler<GetAllColorsQuery> {
  constructor(
    @Inject(colorRepository.COLOR_REPOSITORY)
    private readonly repository: colorRepository.IColorRepository,
  ) {}

  async execute(): Promise<colorRepository.ColorData[]> {
    return await this.repository.findAll();
  }
}
