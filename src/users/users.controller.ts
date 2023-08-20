import { Controller, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { JwtProtect } from '../common/Guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto } from '../auth/dtos/auth.dto';
import { findOneSearchTypes } from './enums/find-one-search-types.enum';

// @UseGuards(AuthGuard('jwt'))
@JwtProtect()
@Serialize(UserDto)
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get(':id')
	async findUser(@Param('id') id: string) {
		const response = await this.usersService.findOne({ id: parseInt(id) }, findOneSearchTypes.POSITIVE);
		return { data: response };
	}

	@Get()
	async findUsers() {
		const response = await this.usersService.find();
		return { data: response };
	}

	@Patch(':id')
	async updateUser(
		@Param('id')
		id: string,
		@Body() body: AuthDto
	) {
		const response = await this.usersService.update(parseInt(id), body);
		return { data: response };
	}

	@Delete(':id')
	deleteUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}

	@Delete()
	deleteAllUsers() {
		return this.usersService.clear();
	}
}
