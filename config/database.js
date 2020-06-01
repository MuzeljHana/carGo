const db_config = require('../config.json');

switch (String(process.env.DATABASE).toLowerCase()) {
    case 'sqlite':
        var config = {
            client: 'sqlite3',
            connection: {
                filename: db_config.sqlite.filename
            },
            useNullAsDefault: true
        };
        break;
    case 'mysql':
    default:
        var config = {
            client: 'mysql',
            connection: db_config.mysql
        };
}

module.exports = require('knex')(config);
