/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Counter, Histogram } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Request, Response } from "express";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric("http_requests_total")
    private readonly httpRequestsCounter: Counter<string>,
    @InjectMetric("http_request_duration_seconds")
    private readonly httpRequestDuration: Histogram<string>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, route, url } = request;
    const path = route?.path || url;

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const statusCode = response.statusCode;
          const duration = (Date.now() - startTime) / 1000;

          // Record metrics
          this.httpRequestsCounter.inc({
            method,
            path,
            status: statusCode,
          });

          this.httpRequestDuration.observe(
            {
              method,
              path,
              status: statusCode,
            },
            duration
          );
        },
        error: (error) => {
          const statusCode = error.status || 500;
          const duration = (Date.now() - startTime) / 1000;

          // Record error metrics
          this.httpRequestsCounter.inc({
            method,
            path,
            status: statusCode,
          });

          this.httpRequestDuration.observe(
            {
              method,
              path,
              status: statusCode,
            },
            duration
          );
        },
      })
    );
  }
}
