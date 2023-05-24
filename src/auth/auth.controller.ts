import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthDto } from 'src/auth/dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async singup(@Body() body: AuthDto) {
		const response = await this.authService.signup(body);
		return { access_token: response };
	}

	@Post('signin')
	async signin(@Body() body: AuthDto) {
		const response = await this.authService.signin(body);
		return { access_token: response };
	}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Request() req) {
		return await this.authService.login(req.user);
	}
}
