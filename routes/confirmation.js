const table = require('../config/models');
const express = require('express');
const router = express.Router();

app.post('/potrdiIzbiro', async(req, res, next) => {
    try {
        let tipTovoraPodatki = {
            naziv: req.body.nazivTipaTovora
        };
        new table.Tip_tovora().save(tipTovoraPodatki);

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
        new table.Tovor().save(tovorPodatki);

        let tovorIskalecPrevozaPodatki = {
            tk_tovor: req.body.idTovor,
            tk_iskalec_prevoza: req.body.idIskalecPrevoza,
            datum_od: req.body.datumOd,
            datum_do: req.body.datumDo
        };
        new table.Povezava().save(tovorIskalecPrevozaPodatki);

        let terminPodatki = {
            tk_tovor: req.body.idTovor,
            tk_naslov: req.body.idNaslov,
            tk_destinacija: req.body.idDestinacija,
            tk_prevozno_sredstvo: req.body.idPrevoznoSredstvo,
            datum_nalaganja: req.body.datumNalaganja,
            datum_dostave: req.body.datumDostave,
            dodatne_pripombe: req.body.dodatnePripombe
        };
        new table.Termin().save(terminPodatki);

        let destinacijaPodatki = {
            tk_naslov: req.body.tkidNaslov
        };
        new table.Destinacija().save(destinacijaPodatki);

        let naslovPodatki = {
            tk_posta: req.body.idPosta,
            ulica: req.body.ulica,
            hisna_st: req.body.hisna_st
        };
        new table.Naslov().save(naslovPodatki);

        let postaPodatki = {
            kraj: req.body.kraj,
            postna_st: req.body.postna_st
        };
        new table.Posta().save(postaPodatki);

        let cenikPodatki = {
            tk_termin: req.body.idTermin,
            znesek: req.body.znesek
        };
        new table.Cenik().save(cenikPodatki);
        
        res.status(200).send("Order successfully confirmed.");
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;