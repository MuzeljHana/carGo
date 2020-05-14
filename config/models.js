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

    Uporabnik: bookshelf.model('Uporabnik', {
        tableName: 'iskalec_prevoza',
        idAttribute: 'id'
    }),

    Tovor: bookshelf.model('Tovor', {
        tableName: 'tovor',
        idAttribute: 'id'
    }),

    Destinacija: bookshelf.model('Destinacija', {
        tableName: 'destinacija',
        idAttribute: 'id'
    }),

    Naslov: bookshelf.model('Naslov', {
        tableName: 'naslov',
        idAttribute: 'id'
    }),

    Posta: bookshelf.model('Posta', {
        tableName: 'posta',
        idAttribute: 'id'
    }),

    Cenik: bookshelf.model('Cenik', {
        tableName: 'cenik',
        idAttribute: 'id'
    }),

    Tip_tovora: bookshelf.model('Tip_tovora', {
        tableName: 'tip_tovora',
        idAttribute: 'id'
    }),
    
    Povezava: bookshelf.model('Povezava', {
        tableName: 'tovor_has_iskalec_prevoza',
        idAttribute: 'id'
    })

}
