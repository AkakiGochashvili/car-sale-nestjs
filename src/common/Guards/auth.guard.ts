import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

export function JwtProtect() {
	return UseGuards(AuthGuard);
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private usersService: UsersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = (await this.jwtService.verifyAsync(token, {
				secret: '2228754d90aa7d5a51ed24ce6794b2a1b52c8d36d2e057fb78534048777ceb8f'
			})) as { id: number; iat: number; exp: number };

			const user = await this.usersService.findOne({ id: payload.id }, 'POSITIVE');

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
