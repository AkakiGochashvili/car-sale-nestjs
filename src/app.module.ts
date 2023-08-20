import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { AuthModule } from './auth/auth.module';

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
		}
	]
})
export class AppModule {}
