const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.get('/:id', (req, res, next) => {
    new table.Vozilo({ id: req.params.id }).fetch()
        .then((vozilo) => {
            res.json(vozilo);
        })
        .catch((err) => {
            res.status(500).json({ "message": err });
        });
});

router.post('/add', async (req, res, next) => {
    let podjetje, tip, znamka, letnik;
    try {
        podjetje = await new table.Podjetje({ naziv: req.body.podjetje }).fetch({ columns: ['id'] });
        tip = await new table.Tip_prevoza({ naziv: req.body.tip }).fetch({ columns: ['id'] });
        znamka = await new table.Znamka({ naziv: req.body.znamka }).fetch({ columns: ['id'] });
        letnik = await new table.Letnik({ naziv: req.body.letnik }).fetch({ columns: ['id'] });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": err });
    }

    let data = {
        registracijska_st: req.body.registracijska_st,
        max_teza: req.body.max_teza_tovora,
        cena: req.body.cena_km,
        potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
        aktivnost: req.body.aktivnost,
        zasedenost: req.body.zasedenost,
        volumen: req.body.volumen,
        dolzina: req.body.dolzina,
        sirina: req.body.sirina,
        visina: req.body.visina,
        st_palet: req.body.st_pelet,
        tk_prevozno_podjetje: podjetje.id,
        tk_znamka: znamka.id,
        tk_tip_prevoza: tip.id,
        tk_letnik: letnik.id
    }
    new table.Vozilo().save(data).then(() => {
        res.json({ "message": "success" });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ "message": err });
    });

});

router.put('/:id/active/:bool', (req, res, next) => {
    new table.Vozilo({ id: req.params.id }).save({ aktivnost: req.params.bool })
        .then(() => {
            res.json({ "message": "success" });
        })
        .catch((err) => {
            res.status(500).json({ "message": err });
        });
});

router.delete('/:id', (req, res, next) => {
    new table.Vozilo({ id: req.params.id }).destroy()
        .then(() => {
            res.json({ "message": "success" });
        })
        .catch((err) => {
            res.status(500).json({ "message": err });
        });
});

module.exports = router;
