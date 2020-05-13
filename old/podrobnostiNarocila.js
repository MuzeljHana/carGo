var express = require('express');
var app = express();

app.use(express.urlencoded({extended:false}));

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host:   '127.0.0.1',
        user:   'root',
        password:   'geslo123',
        database:   'cargo'
    }
});

const bookshelf = require('bookshelf')(knex)

var uporabnik = bookshelf.Model.extend({
    tableName: 'iskalec_prevoza',
    idAttribute: 'id'
});
 var povezava =bookshelf.Model.extend({
     tableName: 'tovor_has_iskalec_prevoza',
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

app.get('/podrobnostiNarocil', async(req, res, next) => {
    try {
        let termini = await new termin().fetchAll();
        res.json(termini.toJSON());        
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/podrobnostiNarocil/:id', async(req, res, next) => {
    try {
        let id_iskalca = req.params.id;
        let termini = await new termin({id: id_iskalca}).fetch();
        res.json(termini.toJSON());        
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3000);