// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "readme-app-dev"
    }
  },

  test: {
    client: "postgresql",
    connection: {
      database: "readme-app-test"
    }
  }
};
