var express = require('express');
var app = express();

app.use(express.urlencoded({extended:false}));

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'geslo123',
        database: 'cargo'
    }
});

const bookshelf = require('bookshelf')(knex)

var prevozno_podjetje = bookshelf.Model.extend({
    tableName: 'prevozno_podjetje',
    idAttribute: 'id'
});

var prevozno_sredstvo = bookshelf.Model.extend({
    tableName: 'prevozno_sredstvo',
    idAttribute: 'id'
});

var tip_prevoza = bookshelf.Model.extend({
    tableName: 'tip_prevoza',
    idAttribute: 'id'
});

var letnik = bookshelf.Model.extend({
    tableName: 'letnik',
    idAttribute: 'id'
});

var znamka = bookshelf.Model.extend({
    tableName: 'znamka',
    idAttribute: 'id'
});

