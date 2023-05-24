import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: '2228754d90aa7d5a51ed24ce6794b2a1b52c8d36d2e057fb78534048777ceb8f'
		});
	}

	async validate(payload: any) {
		return { userId: payload.UserId };
	}
}
