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

app.post('/urediPonudnika', async(req, res, next) => {
    try {
        let prevozno_podjetjeData = {
            naziv: req.body.nazivPrevoznega_podjetja,
            davcna_st: req.body.davcna_stPrevoznega_podjetja,
            zacetek_delovanja: req.body.zacetek_delovanjaPrevoznega_podjetja,
            uspesnost_poslovanja: req.body.uspesnost_poslovanjaPrevoznega_podjetja,
            tk_naslov: req.body.idNaslov
        };
        let tabelaPrevoznega_podjetja = await new prevozno_podjetje().save(prevozno_podjetjeData)
        
        let naslovData = {
            tk_posta: req.body.idPosta,
            ulica: req.body.ulica,
            hisna_st: req.body.hisna_st
        };
        let tabelaNaslov = await new naslov().save(naslovData);

        let postaData = {
            kraj: req.body.kraj,
            postna_st: req.body.postna_st
        };
        let tabelaPosta = await new posta().save(postaData);
           
        res.status(200).send("Ponudnik je bil uspešno urejen.");
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3000);