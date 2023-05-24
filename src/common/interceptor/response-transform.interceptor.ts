import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenericResponseDto } from '../dto/generic-response.dto';

export interface Response<T> {
    result: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => {
                if (data instanceof GenericResponseDto) {
                    return data;
                }
                return GenericResponseDto.create(data);
            }),
        );
    }
}
