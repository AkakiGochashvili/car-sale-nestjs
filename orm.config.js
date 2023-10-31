const dotenv = require('dotenv');

const DBConfig = {
	migrations: ['migrations/*.js']
};

dotenv.config({
	path: `${__dirname}/.env`
});

switch (process.env.NODE_ENV) {
	case 'development':
		Object.assign(DBConfig, {
			type: 'sqlite',
			database: 'db.sqlite',
			synchronize: true,
			entities: ['**/*.entity.js']
		});
		break;
	case 'test':
		Object.assign(DBConfig, {
			type: 'sqlite',
			database: 'test.sqlite',
			entities: ['**/*.entity.ts'],
			synchronize: false,
			migrationsRun: true
		});
		break;
	case 'production':
		Object.assign(DBConfig, {
			synchronize: false,
			type: 'postgres',
			url: process.env.DATABASE_URL,
			migrationsRun: true,
			entities: ['**/*.entity.js'],
			ssl: true,
			extra: {
				ssl: {
					rejectUnauthorized: false
				}
			}
		});
		break;
	default:
		throw new Error('unKnown environment');
}

module.exports = DBConfig;
