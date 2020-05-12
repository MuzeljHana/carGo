var express = require('express');
var app = express();

var iskalecPrevoza = bookshelf.Model.extend({
    tableName: 'iskalec_prevoza',
    idAttribute: 'id'
});

var tovorIskalecPrevoza = bookshelf.Model.extend({
    tableName: 'tovor_has_iskalec_prevoza',
    idAttribute: 'id'
});

var tipTovora = bookshelf.Model.extend({
    tableName: 'tip_tovora',
    idAttribute: 'id'
});

var tovor = bookshelf.Model.extend({
    tableName: 'tovor',
    idAttribute: 'id'
});

var termin = bookshelf.Model.extend({
    tableName: 'termin',
    idAttribute: 'id'
});

var destinacija = bookshelf.Model.extend({
    tableName: 'destinacija',
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

var prevozno_sredstvo = bookshelf.Model.extend({
    tableName: 'prevozno_sredstvo',
    idAttribute: 'id'
});

var cenik = bookshelf.Model.extent({
    tableName: 'cenik',
    idAttribute: 'id'
});

app.post('/potrdiIzbiro', async(req, res, next) => {
    try {
        
    } catch (error) {
        res.status(500).json(error);
    }
});