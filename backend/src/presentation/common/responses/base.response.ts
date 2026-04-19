import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ required: false })
  error?: {
    code: string;
    message: string;
  };

  constructor(partial: Partial<BaseResponse<T>>) {
    Object.assign(this, partial);
  }

  static ok<T>(data: T): BaseResponse<T> {
    return new BaseResponse<T>({
      success: true,
      data,
    });
  }

  static error(code: string, message: string): BaseResponse<null> {
    return new BaseResponse<null>({
      success: false,
      error: { code, message },
    });
  }
}
