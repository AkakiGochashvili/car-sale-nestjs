// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         UsersService,
//         JwtService
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

it('can create an instance of auth service', async () => {
	const fakeUsersService = {
		find: () => Promise.resolve([]),
		create: (email: string, password: string) => Promise.resolve({ id: 1, email, password })
	};

	const module = await Test.createTestingModule({
		providers: [
			AuthService,
			{
				provide: UsersService,
				useValue: fakeUsersService
			},
			JwtService
		]
	}).compile();

	const service = module.get(AuthService);

	expect(service).toBeDefined();
});
