import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			global: true,
			secret: '2228754d90aa7d5a51ed24ce6794b2a1b52c8d36d2e057fb78534048777ceb8f',
			signOptions: { expiresIn: '1h' }
		})
	],
	exports: [UsersService]
})
export class UsersModule {}
