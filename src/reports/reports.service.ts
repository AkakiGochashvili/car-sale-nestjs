import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { findOneSearchTypes } from '../common/enums/find-one-search-types.enum';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private repository: Repository<Report>) {}
	async find() {
		const reports = await this.repository.find();

		return reports;
	}

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

	async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
		return this.repository
			.createQueryBuilder()
			.select('AVG(price)', 'price')
			.where('make = :make', { make: make })
			.andWhere('model = :model', { model: model })
			.andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
			.andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
			.andWhere('year - :year BETWEEN -3 AND 3', { year })
			.andWhere('approved IS TRUE')
			.orderBy('ABS(mileage - :mileage)', 'DESC')
			.setParameters({ mileage })
			.limit(3)
			.getRawOne();
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
