import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

export class GlobalInterceptor implements NestInterceptor {
	constructor() {}

	intercept(_contenxt: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler
			.handle()
			.pipe(
				map((response: any) => {
					return { success: true, ...response };
				})
			)
			.pipe(
				catchError((err) => {
					if (err.response) {
						err.response.sucsess = false;
					}
					return throwError(() => err);
				})
			);
	}
}
