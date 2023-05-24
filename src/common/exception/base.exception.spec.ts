import { ResponseCode } from '../enum/response-code.enum';
import { BaseException } from './base.exception';

describe('BaseException', () => {
    it('should take default values', () => {
        const exception = new BaseException();
        expect(exception.code).toBe(ResponseCode.GENERAL_FAIL);
        expect(exception.message).toBe('failed');
        expect(exception.customMessage).toBeNull();
    });

    it('should customMessage override message', () => {
        const exception = new BaseException(ResponseCode.GENERAL_FAIL, 'ALERT');
        expect(exception.code).toBe(ResponseCode.GENERAL_FAIL);
        expect(exception.message).toBe('ALERT');
        expect(exception.customMessage).toBe('ALERT');
    });
});
