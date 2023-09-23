import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthDto } from '../auth/dtos/auth.dto';
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
	async login(@Request() request) {
		return await this.authService.login(request.user);
	}

	// @UseGuards(AuthGuard('registration'))
	// @Post('registration')
	// async registration(@Request() request, @Body() body: AuthDto) {
	// 	return await this.authService.login(request.user);
	// }
}
