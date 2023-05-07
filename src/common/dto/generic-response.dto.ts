import { ResponseCode } from '../enum/response-code.enum';

export class GenericResponseDto {
  /**
   * Response code
   * @example 0
   */
  code: ResponseCode;

  /**
   * Response message
   * @example 'success'
   */
  message: string;

  result: any;

  constructor(result: any, code: ResponseCode, message: string) {
    this.result = result;
    this.code = code;
    this.message = message;
  }

  static create(result: any, code: ResponseCode = ResponseCode.SUCCESS, message = 'success') {
    return new GenericResponseDto(result, code, message);
  }
}
