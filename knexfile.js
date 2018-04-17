// Update with your config settings.

module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			database: 'readme-app-dev',
			user: 'postgres',
			password: 'coffeeDrinker'
		}
	},

	test: {
		client: 'postgresql',
		connection: {
			database: 'readme-app-test'
		}
	},

	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL + '?ssl=true'
	}
};
