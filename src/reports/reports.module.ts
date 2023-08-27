import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
	controllers: [ReportsController],
	providers: [ReportsService],
	imports: [TypeOrmModule.forFeature([Report])]
})
export class ReportsModule {}
