const knex = require('./database');
const bookshelf = require('bookshelf')(knex);

module.exports = {
    Posta: bookshelf.model('Posta', {
        tableName: 'Posta',
        naslov() {
            return this.hasMany('Naslov');
        }
    }),

    Naslov: bookshelf.model('Naslov', {
        tableName: 'Naslov',
        uporabnik() {
            return this.hasMany('Uporabnik');
        },
        ponudba() {
            return this.hasMany('Ponudba');
        }
    }),

    Uporabnik: bookshelf.model('Uporabnik', {
        tableName: 'Uporabnik',
        vozilo() {
            return this.hasMany('Vozilo');
        },
        ponudba() {
            return this.hasMany('Ponudba');
        }
    }),

    Tip_vozila: bookshelf.model('Tip_vozila', {
        tableName: 'Tip_vozila',
        vozilo() {
            return this.hasMany('Vozilo');
        }
    }),

    Znamka: bookshelf.model('Znamka', {
        tableName: 'Znamka',
        vozilo() {
            return this.hasMany('Vozilo');
        }
    }),

    Vozilo: bookshelf.model('Vozilo', {
        tableName: 'Vozilo',
        ponudba() {
            return this.hasMany('Ponudba');
        },
        cenik() {
            return this.hasMany('Cenik');
        }
    }),

    Cenik: bookshelf.model('Cenik', {
        tableName: 'Cenik'
    }),

    Ponudba: bookshelf.model('Ponudba', {
        tableName: 'Ponudba',
        izdelek() {
            return this.hasMany('Izdelek'); 
        }
    }),

    Izdelek: bookshelf.model('Izdelek', {
        tableName: 'Izdelek'
    }),

    Tip_tovora: bookshelf.model('Tip_tovora', {
        tableName: 'Tip_tovora',
        izdelek() {
            return this.hasMany('Ponudba'); 
        }
    })
}
