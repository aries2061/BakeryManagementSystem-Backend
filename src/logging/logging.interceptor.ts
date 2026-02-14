import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { JsonValue } from '../common/types/json-value.type';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}

  private redactSensitive(value: unknown): JsonValue {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string') {
      if (value.length > 500) {
        return `${value.slice(0, 500)}...[truncated]`;
      }
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.slice(0, 50).map((item) => this.redactSensitive(item));
    }

    if (typeof value === 'object') {
      const sensitiveKeys = new Set([
        'password',
        'token',
        'access_token',
        'refresh_token',
        'authorization',
        'cookie',
        'secret',
      ]);

      const objectValue = value as Record<string, unknown>;
      const result: Record<string, JsonValue> = {};

      for (const [key, fieldValue] of Object.entries(objectValue)) {
        if (sensitiveKeys.has(key.toLowerCase())) {
          result[key] = '[REDACTED]';
          continue;
        }

        result[key] = this.redactSensitive(fieldValue);
      }

      return result;
    }

    return String(value);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = req;
    const module = 'HTTP'; // Or extract from controller metadata
    const action = `${method} ${url}`;

    return next.handle().pipe(
      tap(() => {
        const details = {
          body: this.redactSensitive(body),
          query: this.redactSensitive(query),
          params: this.redactSensitive(params),
        };
        void this.loggingService.logAction(module, action, details);
      }),
    );
  }
}
