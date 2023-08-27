import { AfterInsert, AfterUpdate, BeforeRemove, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@OneToMany(() => Report, (report) => report.user)
	reports: Report[];

	@AfterInsert()
	logInsert() {
		console.info(`Inserted User with id - ${this.id}`);
	}

	@AfterUpdate()
	logUpdate() {
		console.info(`updated User with id - ${this.id}`);
	}

	@BeforeRemove()
	logDelete() {
		console.info(`deleted User with id - ${this.id}`);
	}
}
