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
			url: 'postgres://default:xO3qu7cipQNy@ep-billowing-wood-48312627.us-east-1.postgres.vercel-storage.com:5432/verceldb',
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
