const knex = require('./database');
const bookshelf = require('bookshelf')(knex);

module.exports = {
    Termin: bookshelf.model('Termin', {
        tableName: 'termin',
        idAttribute: 'id'
    }),

    Znamka: bookshelf.model('Znamka', {
        tableName: 'znamka',
        idAttribute: 'id'
    })
}
