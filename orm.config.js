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
			database: 'test.sqlite',
			entities: ['**/*.entity.ts'],
			migrationsRun: true
		});
		break;
	case 'production':
		Object.assign(DBConfig, {
			type: 'postgres',
			url: process.env.DATABASE_URL,
			migrationsRun: true,
			entities: ['**/*.entity.js'],
			ssl: {
				rejectUnauthorized: false
			}
		});
		break;
	default:
		throw new Error('unKnown environment');
}

module.exports = DBConfig;
