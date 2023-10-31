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

module.exports = DBConfig;
