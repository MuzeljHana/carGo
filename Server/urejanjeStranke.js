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

var iskalec_prevoza = bookshelf.Model.extend({
    tableName: 'iskalec_prevoza',
    idAttribute: 'id'
});

var tip_iskalca = bookshelf.Model.extend({
    tableName: 'tip_iskalca',
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

app.post('/urediStranko', async(req, res, next) => {
    try {
        let iskalec_prevozaPodatki = {
            naziv: req.body.nazivIskalca_prevoza,
            davcna_st: req.body.davcna_stIskalca_prevoza,
            tk_naslov: req.body.idNaslov,
            tk_tip_iskalca: req.body.idTip_iskalca
        };
        let tabelaIskalca_prevoza = await new iskalec_prevoza().save(iskalec_prevozaPodatki)
        

        let tip_iskalcaPodatki = {
            naziv: req.body.nazivTipa_Iskalca
        };
        let iskalec_prevozaPodatki= await new tip_iskalca().save(tip_iskalcaPodatki)

        let naslovPodatki = {
            tk_posta: req.body.idPosta,
            ulica: req.body.ulica,
            hisna_st: req.body.hisna_st
        };
        let tabelaNaslov = await new naslov().save(naslovPodatki);

        let postaPodatki = {
            kraj: req.body.kraj,
            postna_st: req.body.postna_st
        };
        let tabelaPosta = await new posta().save(postaPodatki);
           
        res.status(200).send("Stranka uspešno urejena.");
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3000);