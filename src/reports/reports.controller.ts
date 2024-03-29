import { Controller, Post, Body, Patch, Param, Delete, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtProtect } from '../common/Guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { CurrentUser } from '../common/decorators/user.decorator';
import { createReportDto } from './dtos/create-report.dto';
import { ReportResponseDto } from './dtos/report-response.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { approveReportDto } from './dtos/approve-report.dto';
import { findOneSearchTypes } from '../common/enums/find-one-search-types.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
	constructor(private reportsService: ReportsService) {}

	@Get()
	async findReports() {
		const response = await this.reportsService.find();

		return { data: response };
	}

	@Get(':id')
	async findReport(@Param('id') id: string) {
		const response = await this.reportsService.findOne({ id: parseInt(id) }, findOneSearchTypes.POSITIVE);

		return { data: response };
	}

	@Get('/get/estimate')
	getEstimate(@Query() query: GetEstimateDto) {
		// return this.reportsService.createEstimate(query);
		console.log(query);
	}

	@Serialize(ReportResponseDto)
	@Roles(Role.ADMIN)
	@JwtProtect()
	@Post()
	async createReport(@Body() body: createReportDto, @CurrentUser() user: User) {
		const response = await this.reportsService.create(body, user);

		return { data: response };
	}

	@Patch('/:id')
	approveReport(@Param('id') id: string, @Body() body: approveReportDto) {
		return this.reportsService.changeApproval(parseInt(id), body.approved);
	}

	@Delete()
	deleteAllReports() {
		return this.reportsService.clear();
	}
}
