import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';

export function JwtProtect() {
	return UseGuards(AuthGuard);
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor() {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		if (!request.user) {
			throw new UnauthorizedException();
		}

		return true;
	}
}
