import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

export function Register() {
	return UseGuards(AuthGuard('registration'));
}

@Injectable()
export class RegistrationStrategy extends PassportStrategy(Strategy, 'registration') {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string): Promise<any> {
		const user = await this.authService.RegisterUser({ email, password });

		if (!user) {
			throw new BadRequestException('Wrong Password');
		}
		return user;
	}
}
