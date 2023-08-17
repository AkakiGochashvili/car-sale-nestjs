import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from '../../src/auth/dtos/auth.dto';
@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repository: Repository<User>) {}

	async create(user_data: AuthDto) {
		const pre_user = this.repository.create(user_data);

		const user = await this.repository.save(pre_user);

		return user;
	}

	async findOne(query: FindOptionsWhere<User>, searchType: 'POSITIVE' | 'NEGATIVE' | 'PASSIVE') {
		const user = await this.repository.findOneBy(query);

		if (searchType === 'POSITIVE' && !user) {
			throw new NotFoundException('The user could not be found with the specified params');
		}

		if (searchType === 'NEGATIVE' && user) {
			throw new BadRequestException(`The user is already registered with this ${Object.keys(query)[0]}`);
		}

		return user;
	}

	async find() {
		const users = await this.repository.find();

		return users;
	}

	async update(id: number, attributes: Partial<User>) {
		const user = await this.findOne({ id }, 'POSITIVE');

		Object.assign(user, attributes);

		this.repository.save(user);

		return user;
	}

	async remove(id: number) {
		const user = await this.findOne({ id }, 'POSITIVE');

		await this.repository.remove(user);
	}

	async clear() {
		await this.repository.clear();
	}
}
