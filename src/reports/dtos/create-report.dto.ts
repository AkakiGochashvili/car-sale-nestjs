import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';

export class createReportDto {
	@IsString()
	make: string;

	@IsString()
	model: string;

	@IsNumber()
	@Min(1930)
	@Max(new Date(Date.now()).getFullYear() + 1)
	year: number;

	@IsNumber()
	@Min(0)
	@Max(1000000)
	mileage: number;

	@IsNumber()
	@IsLongitude()
	lng: number;

	@IsLatitude()
	@IsNumber()
	lat: number;

	@IsNumber()
	@Min(0)
	@Max(5000000)
	price: number;
}
