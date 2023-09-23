import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { User } from '../../users/user.entity';

const clc = require('cli-color');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, baseUrl: url } = request;

		const role = (request.user as User)?.role ? (request.user as User)?.role : 'UNAUTHORIZED';

		const startAt = Date.now();

		const userAgent = request.get('user-agent') || '';

		response.on('finish', () => {
			const { statusCode } = response;

			const contentLength = response.get('content-length');

			const response_time = Date.now() - startAt;

			console.log(clc.cyan(`[${role}]   ${method}   ${url}   ${statusCode}   ${response_time}ms  -  ${contentLength}  ${userAgent} ${ip}`));
		});

		next();
	}
}
