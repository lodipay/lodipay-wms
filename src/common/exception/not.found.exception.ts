import { ResponseCode } from '../enum/response-code.enum';
import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(message = 'Not found') {
    super(ResponseCode.NOT_FOUND, message);
  }
}
