import { ResponseCode } from '../enum/response-code.enum';

export class BaseException extends Error {
  constructor(
    public readonly code: ResponseCode = ResponseCode.GENERAL_FAIL,
    public readonly customMessage: string = null,
  ) {
    super(customMessage || 'failed');
  }
}
