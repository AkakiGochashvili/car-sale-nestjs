import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

export function login() {
	return UseGuards(AuthGuard('local'));
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(email, password);

		if (!user) {
			throw new BadRequestException('Wrong Password');
		}
		return user;
	}
}
