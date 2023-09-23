import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { findOneSearchTypes } from '../common/enums/find-one-search-types.enum';

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private repository: Repository<Report>) {}

	async findOne(query: FindOptionsWhere<Report>, searchType: findOneSearchTypes) {
		const report = await this.repository.findOneBy(query);

		if (searchType === findOneSearchTypes.POSITIVE && !report) {
			throw new NotFoundException('The report could not be found with the specified params');
		}

		if (searchType === findOneSearchTypes.NEGATIVE && report) {
			throw new BadRequestException(`The report is already created with this ${Object.keys(query)[0]}`);
		}

		return report;
	}

	async create(report_data: createReportDto, user: User) {
		const report_instance = this.repository.create(report_data);

		const report = await this.repository.save({ ...report_instance, user: user });

		return report;
	}

	async update(id: number, attributes: Partial<Report>) {
		const report = await this.findOne({ id }, findOneSearchTypes.POSITIVE);

		Object.assign(report, attributes);

		this.repository.save(report);

		return report;
	}

	async changeApproval(id: number, approved: boolean) {
		await this.findOne({ id }, findOneSearchTypes.POSITIVE);

		await this.update(id, { approved });

		return true;
	}

	async clear() {
		await this.repository.clear();

		return true;
	}
}
