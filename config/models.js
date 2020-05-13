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
    }),

    Vozilo: bookshelf.model('Vozilo', {
        tableName: 'prevozno_sredstvo',
        idAttribute: 'id'
    }),

    Podjetje: bookshelf.model('Podjetje', {
        tableName: 'prevozno_podjetje',
        idAttribute: 'id'
    }),

    Tip_prevoza: bookshelf.model('Tip_prevoza', {
        tableName: 'tip_prevoza',
        idAttribute: 'id'
    }),

    Letnik: bookshelf.model('Letnik', {
        tableName: 'letnik',
        idAttribute: 'id'
    }),

    
}
