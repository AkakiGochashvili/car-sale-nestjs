/** @format */

import { UsersService } from '../users/users.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { AuthDto } from 'src/auth/dtos/auth.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}

	async getSignedJWT(id: number) {
		const access_token = await this.jwtService.signAsync({ id });
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

	async signin(user_data: AuthDto) {
		const user = await this.usersService.findOne({ email: user_data.email }, 'POSITIVE');

		const match_password = await bcrypt.compare(user_data.password, user.password);

		if (!match_password) {
			throw new BadRequestException('Wrong Password');
		}

		const access_token = await this.getSignedJWT(user.id);

		return access_token;
	}
	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.usersService.findOne({ email }, 'POSITIVE');
		if (user && user.password === password) {
			return user;
		}
		return null;
	}

	async login(user: User): Promise<{ access_token: string }> {
		// const payload = { username: user.username, sub: user.userId };
		// return {
		// 	access_token: this.jwtService.sign(payload)
		// };

		const payload = {
			email: user.email,
			sub: user.id
		};

		return {
			access_token: this.jwtService.sign(payload)
		};
	}

	async verify(token: string): Promise<User> {
		const decoded = this.jwtService.verify(token, { secret: '2228754d90aa7d5a51ed24ce6794b2a1b52c8d36d2e057fb78534048777ceb8f' });

		const user = this.usersService.findOne({ email: decoded.email }, 'POSITIVE');

		return user;
	}
}
