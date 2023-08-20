import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('handles a singup request', () => {
		const email = 'testemail@gmail.com';
		return request(app.getHttpServer())
			.post('/auth/signup')
			.send({ email, password: '123123' })
			.expect(201)
			.then((response) => {
				const { access_token } = response.body;

				expect(access_token).toBeDefined();
			});
		expect('asd').toEqual('asd');
	});
});
