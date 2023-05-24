import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
	constructor(private authService: AuthService) {}

	@Post('auth1/login')
	async login(@Request() req) {
		console.log(1);
		console.log(req.user);
		return this.authService.login(req.user);
	}
}
