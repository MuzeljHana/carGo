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
            tk_tip_tovora: req.body.idTipTovora,
            naziv: req.body.nazivTovora,
            dolzina: req.body.dolzina,
            visina: req.body.visina,
            sirina: req.body.sirina,
            teza: req.body.teza,
            st_palet: req.body.stPalet,
            volumen: req.body.volumen
        };
        let tabelaTovor = await new tovor().save(tovorPodatki);

        let tovorIskalecPrevozaPodatki = {
            tk_tovor: req.body.idTovor,
            tk_iskalec_prevoza: req.body.idIskalecPrevoza,
            datum_od: req.body.datumOd,
            datum_do: req.body.datumDo
        };
        let tabelaTovorIskalecPrevoza = await new tovorIskalecPrevoza().save(tovorIskalecPrevozaPodatki);

        let terminPodatki = {
            tk_tovor: req.body.idTovor,
            tk_naslov: req.body.idNaslov,
            tk_destinacija: req.body.idDestinacija,
            tk_prevozno_sredstvo: req.body.idPrevoznoSredstvo,
            datum_nalaganja: req.body.datumNalaganja,
            datum_dostave: req.body.datumDostave,
            dodatne_pripombe: req.body.dodatnePripombe
        };
        let tabelaTermin = await new termin().save(terminPodatki);

        let destinacijaPodatki = {
            tk_naslov: req.body.tkidNaslov
        };
        let tabelaDestinacija = await new destinacija().save(destinacijaPodatki);

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

        let cenikPodatki = {
            tk_termin: req.body.idTermin,
            znesek: req.body.znesek
        };
        let tabelaCenika = await new cenik().save(cenikPodatki);
        res.status(200).send("Naročilo uspešno dodano.");
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3000);