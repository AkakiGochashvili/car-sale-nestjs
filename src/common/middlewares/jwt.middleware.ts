import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { findOneSearchTypes } from '../enums/find-one-search-types.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
	constructor(private jwtService: JwtService, private usersService: UsersService, private configService: ConfigService) {}

	async use(request: Request, _response: Response, next: NextFunction) {
		const token = this.extractTokenFromHeader(request);

		if (token) {
			try {
				const payload = (await this.jwtService.verifyAsync(token, {
					secret: String(this.configService.get('JWT_SECRET'))
				})) as { id: number; iat: number; exp: number };

				const user = await this.usersService.findOne({ id: payload.id }, findOneSearchTypes.POSITIVE);

				request['user'] = user;
			} catch {
				request['user'] = null;
			}
		}

		next();
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
