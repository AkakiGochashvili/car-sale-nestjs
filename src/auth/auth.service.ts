/** @format */

import { UsersService } from '../users/users.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { AuthDto } from '../../src/auth/dtos/auth.dto';
import { User } from '../../src/users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService, private config: ConfigService) {}

	async getSignedJWT(id: number) {
		const secret = await this.config.get('JWT_SECRET');

		const access_token = await this.jwtService.signAsync(
			{
				sub: id,
				email: 123
			},

			{
				expiresIn: '15m',
				secret
			}
		);
		return access_token;
	}

	async signup(user_data: AuthDto) {
		await this.usersService.findOne({ email: user_data.email }, 'NEGATIVE');

		const salt = await bcrypt.genSalt(10);

		const hashed_password = await bcrypt.hash(user_data.password, salt);

		user_data.password = hashed_password;

		const user = await this.usersService.create(user_data);

		const access_token = await this.getSignedJWT(user.id);

		return access_token;
	}

	async signin(user_data: AuthDto): Promise<string> {
		const user = await this.usersService.findOne({ email: user_data.email }, 'POSITIVE');

		const match_password = await bcrypt.compare(user_data.password, user.password);

		if (!match_password) {
			throw new BadRequestException('Wrong Password');
		}

		const access_token = await this.getSignedJWT(user.id);

		return access_token;
	}

	// async validateUser(email: string, pass: string): Promise<User> {
	// 	const user = await this.usersService.findOne({ email }, 'POSITIVE');

	// 	const match_password = await bcrypt.compare(pass, user.password);

	// 	if (user && match_password) {
	// 		return user;
	// 	}
	// 	return null;
	// }

	// async login(user: User) {
	// 	const payload = { userId: user.id };
	// 	return {
	// 		access_token: this.jwtService.sign(payload)
	// 	};
	// }

	// async RegisterUser(user_data: AuthDto) {
	// 	await this.usersService.findOne({ email: user_data.email }, 'NEGATIVE');

	// 	const salt = await bcrypt.genSalt(10);

	// 	const hashed_password = await bcrypt.hash(user_data.password, salt);

	// 	user_data.password = hashed_password;

	// 	const user = await this.usersService.create(user_data);

	// 	if (user) {
	// 		return user;
	// 	}

	// 	return null;
	// }
}
