import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';

export function AdminProtect() {
	return UseGuards(AdminGuard);
}

export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		return request.user.admin;
	}
}
