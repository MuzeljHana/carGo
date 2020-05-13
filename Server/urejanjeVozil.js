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

pp.post('/urediPonudnika', async(req, res, next) => {
    try {
        let prevozno_podjetjeData = {
            naziv: req.body.nazivPrevoznega_podjetja,
            davcna_st: req.body.davcna_stPrevoznega_podjetja,
            zacetek_delovanja: req.body.zacetek_delovanjaPrevoznega_podjetja,
            uspesnost_poslovanja: req.body.uspesnost_poslovanjaPrevoznega_podjetja,
            tk_naslov: req.body.idNaslov
        };
        let tabelaPrevoznega_podjetja = await new prevozno_podjetje().save(prevozno_podjetjeData)
        
        let prevozno_sredstvoData= {
            registracijska_st: req.body.registracijska_stPrevoznega_sredstva,
            max_teza_tovora: req.body.max_teza_tovoraPrevoznega_sredstva,
            cena_km: req.body.cena_kmPrevoznega_sredstva,
            potrdilo_izpravnosti: req.body.potrdilo_izpravnostiPrevoznega_sredstva,
            aktivnost: req.body.aktivnostPrevoznega_sredstva,
            zasedenost: req.body.zasedenostPrevoznega_sredstva,
            volumen: req.body.volumenPrevoznega_sredstva,
            dolzina: req.body.dolzinaPrevoznega_sredstva,
            sirina: req.body.sirinaPrevoznega_sredstva,
            visina: req.body.visinaPrevoznega_sredstva,
            st_pelet: req.body.st_peletPrevoznega_sredstva,
            tk_znamka: req.body.idZnamka,
            tk_tip_prevoza: req.body.idTip_prevoza,
            tk_letnik: req.body.idLetnik
        }
        let tabelaPrevoznega_sredstva = await new prevozno_sredstvo().save(prevozno_sredstvoData)

        let tip_prevozaData= {
            naziv: req.body.nazivTipa_prevoza
        }
        let tabelaTipa_prevoza = await new tip_prevoza().save(tip_prevozaData)

        let letnikData = {
            leto: req.body.letoLetnik
        }
        let tabelaLetnika = await new letnik().save(letnikData)

        let znamkaData = {
            naziv: req.body.nazivZnamka
        }
        let tabelaZnamk = await new znamka().save(znamkaData)
        
        res.status(200).send("Vozilo je bilo uspešno urejeno.");
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3000);
