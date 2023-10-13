import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { User } from '../../users/user.entity';

const clc = require('cli-color');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, baseUrl: url } = request;

		const role = (request?.user as User)?.role ? (request?.user as User)?.role : 'UNAUTHORIZED';

		const startAt = Date.now();

		const userAgent = request.get('user-agent') || '';

		response.on('finish', () => {
			const { statusCode } = response;

			const contentLength = response.get('content-length');

			const response_time = Date.now() - startAt;

			let status_code_log: string;

			if (statusCode >= 200 && statusCode < 300) {
				status_code_log = clc.green(`${statusCode}`);
			}

			if (statusCode >= 400 && statusCode < 400) {
				status_code_log = clc.yellow(statusCode);
			}

			if (statusCode >= 400) {
				status_code_log = clc.red(statusCode);
			}

			console.log(
				clc.cyan(
					`${clc.yellow(`[${role}]`)}   ${method}   ${url}   ${
						status_code_log || statusCode
					}   ${response_time}ms  -  ${contentLength}      ${userAgent} ${ip}`
				)
			);
		});

		next();
	}
}
