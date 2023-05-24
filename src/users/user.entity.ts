import { AfterInsert, AfterUpdate, BeforeRemove, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@AfterInsert()
	logInsert() {
		console.log(`Inserted User with id - ${this.id}`);
	}

	@AfterUpdate()
	logUpdate() {
		console.log(`updated User with id - ${this.id}`);
	}

	@BeforeRemove()
	logDelete() {
		console.log(`deleted User with id - ${this.id}`);
	}
}