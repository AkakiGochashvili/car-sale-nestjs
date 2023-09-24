import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './common/middlewares/jwt.middleware';
import { RolesGuard } from './common/Guards/roles.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`
		}),
		UsersModule,
		AuthModule,
		ReportsModule,
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: 'sqlite',
					database: config.get('DB_NAME'),
					synchronize: true,
					entities: [User, Report]
				};
			}
		})
	],
	providers: [
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({ whitelist: true })
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		}
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(JwtMiddleware).forRoutes('*');

		if (process.env.NODE_ENV === 'development') {
			consumer.apply(LoggerMiddleware).forRoutes('*');
		}
	}
}
