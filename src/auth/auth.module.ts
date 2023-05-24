import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
	controllers: [AuthController],
	exports: [AuthService],
	providers: [AuthService],
	imports: [
		UsersModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			global: true,
			secret: '2228754d90aa7d5a51ed24ce6794b2a1b52c8d36d2e057fb78534048777ceb8f',
			signOptions: { expiresIn: '1h' }
		})
	]
})
export class AuthModule {}
