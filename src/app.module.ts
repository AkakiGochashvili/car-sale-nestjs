import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		ReportsModule,
		ConfigModule.forRoot({
			isGlobal: true
			// envFilePath: './environments/.env.development'
		}),
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'db.sqlite',
			entities: [User, Report],
			synchronize: true
		})
	]
})
export class AppModule {}
