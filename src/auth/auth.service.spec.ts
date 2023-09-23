import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { FindOptionsWhere } from 'typeorm';
import { User } from '../users/user.entity';
import { AuthDto } from './dtos/auth.dto';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { findOneSearchTypes } from '../common/enums/find-one-search-types.enum';

describe('AuthService', () => {
	let service: AuthService;
	let fakeUsersService: Partial<UsersService>;

	beforeEach(async () => {
		const users: User[] = [];
		fakeUsersService = {
			findOne: (query: FindOptionsWhere<User>, searchType: findOneSearchTypes) => {
				let filtered_users: User[] = users;

				for (const query_item in query) {
					filtered_users === filtered_users.filter((user) => user[query_item] === query[query_item]);
				}

				return Promise.resolve(filtered_users[0]);
			},

			create: (user_data: AuthDto) => {
				const user = {
					...user_data,
					id: Math.floor(Math.random() * 999999)
				} as User;

				users.push(user);

				return Promise.resolve(user);
			}
		};

		const module = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,

					useValue: fakeUsersService
				},
				JwtService,
				ConfigService
			],
			imports: [ConfigModule.forRoot()]
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('can create an instance of auth service', async () => {
		expect(service).toBeDefined();
	});

	it('creates a new user and returns access token', async () => {
		const access_token = await service.signup({ email: 'email2@gmail.com', password: '123123' });

		expect(access_token).toBeDefined();
	});

	it('Checks email and password and returns access token', async () => {
		await service.signup({ email: 'email2@gmail.com', password: '123123' });
		const access_token = await service.signin({ email: 'email@gmail.com', password: '123123' });

		expect(access_token).toBeDefined();
	});

	it('throws an error if password is wrong', async () => {
		await service.signup({ email: 'email2@gmail.com', password: '123123' });

		await expect(service.signin({ email: 'email2@gmail.com', password: '12312' })).rejects.toThrow(BadRequestException);
	});
});
