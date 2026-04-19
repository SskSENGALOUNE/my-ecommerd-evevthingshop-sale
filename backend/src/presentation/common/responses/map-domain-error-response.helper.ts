// helpers/error.mapper.ts

import { CustomNotFoundException } from 'src/domain/exceptions/exception-custom-notfound';
import { BaseResponse } from './base.response';

export function mapDomainErrorToResponse(err: Error) {
  switch (true) {
    case err instanceof CustomNotFoundException:
      return BaseResponse.error(err.name, err.message);
    default:
      return BaseResponse.error(
        'INTERNAL_SERVER_ERROR',
        'An unexpected error occurred.',
      );
  }
}
