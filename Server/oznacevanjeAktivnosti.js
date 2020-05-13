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

var prevozno_sredstvo = bookshelf.Model.extend({
    tableName: 'prevozno_sredstvo',
    idAttribute: 'id'
});

pp.post('/oznaciAktivnost', async(req, res, next) => {
    try {  
        let prevozno_sredstvoDataAktivnosti= {
            aktivnost: req.body.aktivnostPrevoznega_sredstva
        }
        let tabelaAktivnosti = await new prevozno_sredstvo().save(prevozno_sredstvoDataAktivnosti)

        res.status(200).send("Aktivnost je bila uspešno označena!");
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3000);
