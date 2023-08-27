import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private repository: Repository<Report>) {}

	async create(report_data: createReportDto, user: User) {
		const report_instance = this.repository.create(report_data);

		const report = await this.repository.save({ ...report_instance, user: user });

		return report;
	}
}
