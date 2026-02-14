import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private loggingService: LoggingService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body, query, params } = req;
        const module = 'HTTP'; // Or extract from controller metadata
        const action = `${method} ${url}`;

        return next.handle().pipe(
            tap((data) => {
                // Log successful requests
                // Be careful not to log sensitive data or huge payloads
                const details = {
                    body,
                    query,
                    params,
                    // response: data, // Optional: might be too large
                };
                this.loggingService.logAction(module, action, details);
            }),
        );
    }
}
