import { LocalStrategy } from './../common/strategies/local.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { RegistrationStrategy } from '../common/strategies/registration.strategy';

@Module({
	controllers: [AuthController],
	exports: [AuthService],
	providers: [AuthService, LocalStrategy, JwtStrategy, RegistrationStrategy],
	imports: [
		PassportModule,
		ConfigModule.forRoot(),
		JwtModule.register({
			global: true
		})
	]
})
export class AuthModule {}
