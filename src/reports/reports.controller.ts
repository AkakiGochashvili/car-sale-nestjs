import { Controller, Post, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtProtect } from '../common/Guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { CurrentUser } from '../common/decorators/user.decorator';
import { createReportDto } from './dtos/create-report.dto';
import { ReportResponseDto } from './dtos/report-response.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';

@ApiTags('Reports')
@ApiBearerAuth()
@Serialize(ReportResponseDto)
@Controller('reports')
export class ReportsController {
	constructor(private reportsService: ReportsService) {}

	@JwtProtect()
	@Post()
	createReport(@Body() body: createReportDto, @CurrentUser() user: User) {
		return this.reportsService.create(body, user);
	}
}
