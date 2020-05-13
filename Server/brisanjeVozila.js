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

var vozilo = bookshelf.Model.extend({
    tableName: 'prevozno_sredstvo',
    idAttribute: 'id'
});

app.delete('/izbrisiVozila/:id', async(req, res, next) => {
    try{
        let id_vozila = req.params.id;
        await new vozilo({id: id_vozila}).destroy();
        res.send("Vozilo je izbrisano!");
    } catch(error){
        res.status(500).json(error);
    }
});

app.listen(3000);
