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

const bookshelf = require('bookshelf')(knex);

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

var cenik = bookshelf.Model.extend({
    tableName: 'cenik',
    idAttribute: 'id'
});

app.post('/potrdiIzbiro', async(req, res, next) => {
    try {
        let tipTovoraPodatki = {
            naziv: req.body.nazivTipaTovora
        };
        let tabelaTipTovora = await new tipTovora().save(tipTovoraPodatki);

        let tovorPodatki = {
            naziv: req.body.nazivTovora,
            dolzina: req.body.dolzina,
            visina: req.body.visina,
            sirina: req.body.sirina,
            teza: req.body.teza,
            st_palet: req.body.stPalet,
            volumen: req.body.volumen
        };
        let tabelaTovor = await new tovor().save(tovorPodatki);

        let terminPodatki = {
            datum_nalaganja: req.body.datumNalaganja,
            datum_dostave: req.body.datumDostave
        };
        let tabelaTermin = await new termin().save(terminPodatki);

        let naslovPodatki = {
            ulica: req.body.ulica,
            hisna_st: req.body.hisna_st
        };
        let tabelaNaslov = await new naslov().save(naslovPodatki);

        let postaPodatki = {
            kraj: req.body.kraj,
            postna_st: req.body.postna_st
        };
        let tabelaPosta = await new posta().save(postaPodatki);

        let cenikPodatki = {
            znesek: req.body.znesek
        };
        let tabelaCenika = await new cenik().save(cenikPodatki);
        res.status(200).send("Naročilo uspešno dodano.");
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3000);