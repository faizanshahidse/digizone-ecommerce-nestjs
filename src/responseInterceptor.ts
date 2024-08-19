import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface Response<T> {
  message: string;
  success: boolean;
  result: any;
  timeStamp: Date;
  statusCode: number;
  path: string;
  error: any;
}

export class responseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    const ctx = context.switchToHttp();

    const statusCode = ctx.getResponse().statusCode;
    const path = ctx.getRequest().url;

    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        success: data.success,
        result: data.result || data,
        timeStamp: new Date(),
        statusCode,
        error: data.error,
        path,
      })),
    );
  }
}
