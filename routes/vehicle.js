const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.get('/:id', (req, res, next) => {
    new table.Vozilo({ id: req.params.id }).fetch()
        .then((vozilo) => {
            res.json(vozilo);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.post('/add', async (req, res, next) => {
    try {
        let podjetje = await new table.Podjetje({ "naziv": req.body.podjetje }).fetch([columns = "id"]);
        let tip = await new table.Tip_prevoza({ "naziv": req.body.tip }).fetch([columns = "id"]);
        let znamka = await new table.Znamka({ "naziv": req.body.znamka }).fetch([columns = "id"]);
        let letnik = await new table.Letnik({ "naziv": req.body.letnik }).fetch([columns = "id"]);
    } catch (err) {
        res.status(500).json(error);
    }

    let data = {
        registracijska_st: req.body.registracijska_st,
        max_teza_tovora: req.body.max_teza_tovora,
        cena_km: req.body.cena_km,
        potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
        aktivnost: req.body.aktivnost,
        zasedenost: req.body.zasedenost,
        volumen: req.body.volumen,
        dolzina: req.body.dolzina,
        sirina: req.body.sirina,
        visina: req.body.visina,
        st_pelet: req.body.st_pelet,
        tk_prevozno_podjetje: podjetje,
        tk_znamka: znamka,
        tk_tip_prevoza: tip,
        tk_letnik: letnik
    }
    new table.Vozilo().save(data).then(() => {
        res.status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });

});

router.put('/:id/active/:bool', (req, res, next) => {
    new table.Vozilo({ id: req.params.id }).save({ aktivnost: req.params.bool }, { patch: true })
        .then(() => {
            res.status(200);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.delete('/:id', (req, res, next) => {
    new table.Vozilo({ id: req.params.id }).destroy()
        .then(() => {
            res.status(200);
        })
        .catch((err) => {
            res.status(500).json(error);
        });
});

module.exports = router;
