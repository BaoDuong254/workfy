import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RESPONSE_MESSAGE } from "src/decorator/customize";

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<{ url: string; path: string }>();

    // Skip transformation for /metrics endpoint (Prometheus)
    if (request.url === "/api/v1/metrics" || request.path === "/api/v1/metrics") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse<{ statusCode: number }>().statusCode,
        message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || "",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: data,
      }))
    );
  }
}
