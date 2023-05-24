import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToClass } from 'class-transformer';

interface classConsturctor {
	new (...args: any[]): {};
}

export function Serialize(dto: classConsturctor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: any) {}

	intercept(_contenxt: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(
			map((response: any) => {
				if (response.data) {
					response.data = plainToClass(this.dto, response.data, {
						excludeExtraneousValues: true
					});

					return response;
				} else {
					return plainToClass(this.dto, response, {
						excludeExtraneousValues: true
					});
				}
			})
		);
	}
}
