import { LocalStrategy } from './../common/strategies/local.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegistrationStrategy } from '../common/strategies/registration.strategy';

@Module({
	controllers: [AuthController],
	exports: [AuthService],
	providers: [AuthService, LocalStrategy, JwtStrategy, RegistrationStrategy],
	imports: [
		PassportModule,
		ConfigModule.forRoot(),
		JwtModule.registerAsync({
			global: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get('JWT_SECRET'),
					signOptions: { expiresIn: '1h' }
				};
			}
		})
	]
})
export class AuthModule {}
