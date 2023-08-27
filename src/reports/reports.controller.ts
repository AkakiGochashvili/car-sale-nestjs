import { Controller, Post, Body } from '@nestjs/common';
import { createReportDto } from './dtos/create-repost.dto';
import { ReportsService } from './reports.service';
import { JwtProtect } from '../common/Guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
	constructor(private reportsService: ReportsService) {}

	@JwtProtect()
	@Post()
	createRepost(@Body() body: createReportDto) {
		return this.reportsService.create(body);
	}
}
