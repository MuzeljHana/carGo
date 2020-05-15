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
        tk_prevozno_podjetje: podjetje.get('id'),
        tk_znamka: znamka.get('id'),
        tk_tip_prevoza: tip.get('id'),
        tk_letnik: letnik.get('id')
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

router.put('/:id/occupied/:bool', (req, res, next) => {
    new table.Vozilo({ id: req.params.id }).save({ zasedenost: req.params.bool })
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

router.post('/editVehicle', async(req, res, next) => {
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
        
        let data= {
            id: req.body.vozilo,
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
            tk_znamka: znamka.get('id'),
            tk_tip_prevoza: tip.get('id'),
            tk_letnik: letnik.get('id'),
            tk_prevozno_podjetje: podjetje.get('id')
        }
        new table.Vozilo().save(data).then(() => {
            res.json({ "message": "success" });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ "message": err });
        });
        /*
        let tabelaPrevoznega_sredstva = await new Vozilo().save(prevozno_sredstvoData)

        let tip_prevozaData= {
            naziv: req.body.nazivTipa_prevoza
        }
        let tabelaTipa_prevoza = await new Tip_prevoza().save(tip_prevozaData)

        let letnikData = {
            leto: req.body.letoLetnik
        }
        let tabelaLetnika = await new Letnik().save(letnikData)

        let znamkaData = {
            naziv: req.body.nazivZnamka
        }
        let tabelaZnamk = await new Znamka().save(znamkaData)
        
        res.status(200).send("Vehicle was successfully updated.");
    } catch (error) {
        res.status(500).json(error);
    }
    */
});

module.exports = router;
