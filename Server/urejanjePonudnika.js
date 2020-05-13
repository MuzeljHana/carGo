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

var naslov = bookshelf.Model.extend({
    tableName: 'naslov',
    idAttribute: 'id'
});

var posta = bookshelf.Model.extend({
    tableName: 'posta',
    idAttribute: 'id'
});
