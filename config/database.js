switch (String(process.env.DATABASE).toLowerCase()) {
    case 'sqlite':
        var config = {
            client: 'sqlite3',
            connection: {
                filename: './database.sqlite'
            },
            useNullAsDefault: true
        };
        break;
    case 'mysql':
    default:
        var config = {
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                user: 'root',
                password: 'geslo123',
                database: 'cargo'
            }
        };
}

module.exports = require('knex')(config);
