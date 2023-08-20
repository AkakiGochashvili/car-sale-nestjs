import { ConfigService } from '@nestjs/config/dist';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { findOneSearchTypes } from '../../users/enums/find-one-search-types.enum';

export function JwtProtect() {
	return UseGuards(AuthGuard);
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private usersService: UsersService, private configService: ConfigService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = (await this.jwtService.verifyAsync(token, {
				secret: String(this.configService.get('JWT_SECRET'))
			})) as { id: number; iat: number; exp: number };

			const user = await this.usersService.findOne({ id: payload.id }, findOneSearchTypes.POSITIVE);

			request['user'] = user;
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
