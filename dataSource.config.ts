import { DataSource, DataSourceOptions } from 'typeorm';

const DBConfig = {
	synchronize: false,
	migrations: ['migrations/*.js']
};

switch (process.env.NODE_ENV) {
	case 'development':
		Object.assign(DBConfig, {
			type: 'sqlite',
			database: 'db.sqlite',
			entities: ['**/*.entity.js']
		});
		break;
	case 'test':
		Object.assign(DBConfig, {
			type: 'sqlite',
			database: 'db.sqlite',
			entities: ['**/*.entity.ts']
		});
		break;
	case 'production':
		break;
	default:
		throw new Error('unKnown environment');
}

export const AppDataSource = new DataSource(DBConfig as DataSourceOptions);

AppDataSource.initialize()
	.then(() => {
		console.log('Data Source has been initialized!');
	})
	.catch((err) => {
		console.error('Error during Data Source initialization', err);
	});
