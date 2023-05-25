import { ResponseCode } from '../enum/response-code.enum';
import { BaseException } from './base.exception';

export class InvalidArgumentException extends BaseException {
    constructor(message = 'Invalid arguments') {
        super(ResponseCode.INVALID_ARGUMENTS, message);
    }
}
