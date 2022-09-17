import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError } from '../errors';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        switch (error.type) {
          case BusinessError.NOT_FOUND:
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
          case BusinessError.PRECONDITION_FAILED:
            throw new HttpException(
              error.message,
              HttpStatus.PRECONDITION_FAILED,
            );
          case BusinessError.BAD_REQUEST:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          case BusinessError.VALUE_IS_NOT_VALID:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          default:
            throw error;
        }
      }),
    );
  }
}
