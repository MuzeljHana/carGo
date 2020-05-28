const knex = require('./database');
const bookshelf = require('bookshelf')(knex);
const fileUpload = require('express-fileupload');
app.use(fileUpload());

module.exports = {
    Izdelek: bookshelf.model('Izdelek', {
        tableName: 'Izdelek'
    }),

    Ponudba: bookshelf.model('Ponudba', {
        tableName: 'Ponudba',
        izdelek() {
            return this.hasMany('Izdelek');
        }
    }),

    Tip_tovora: bookshelf.model('Tip_tovora', {
        tableName: 'Tip_tovora',
        izdelek() {
            return this.hasMany('Ponudba');
        }
    }),

    Cenik: bookshelf.model('Cenik', {
        tableName: 'Cenik',
        vozilo() {
            return this.belongsTo('Vozilo')
        }
    }),

    Vozilo: bookshelf.model('Vozilo', {
        tableName: 'Vozilo',
        ponudba() {
            return this.hasMany('Ponudba');
        },
        cenik() {
            return this.hasMany('Cenik', 'idVozilo');
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

    Uporabnik: bookshelf.model('Uporabnik', {
        tableName: 'Uporabnik',
        vozilo() {
            return this.hasMany('Vozilo');
        },
        ponudba() {
            return this.hasMany('Ponudba');
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

    Posta: bookshelf.model('Posta', {
        tableName: 'Posta',
        naslov() {
            return this.hasMany('Naslov');
        }
    })
}
