const auth = require('./auth');
const knex = require('../config/database');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();

router.post('/search', (req, res, next) => {
    const query = knex.from('Vozilo as v')
        .select([
            "v.id",
            "letnik",
            "model",
            "maks_teza_tovora",
            "maks_volumen_tovora",
            "maks_dolzina_tovora",
            "maks_sirina_tovora",
            "maks_visina_tovora",
            "maks_st_palet",
            "t.naziv as tip_vozila",
            "z.naziv as znamka",
            "c.cena_na_km",
            "u.naziv_podjetja"
        ])
        .where({
            "v.aktivno": 1,
            "v.zasedeno": 0,
            "v.deleted": 0,
            "c.datum_od": (qb) => {
                qb.from("Cenik as c2").max("c2.datum_od").whereRaw("c2.idVozilo = v.id", []);
            }
        })
        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .join("Uporabnik as u", { 'u.id': 'v.idUporabnik' });

    if (req.body.dodatno) {
        if (req.body.dodatno.cena) {
            query.andWhere("c.cena_na_km", "<=", req.body.dodatno.cena);
        }
        if (req.body.dodatno.prevoznik) {
            query.andWhere("u.naziv_podjetja", "like", "%" + req.body.dodatno.prevoznik.trim() + "%");
        }
        if (req.body.dodatno.letnik) {
            query.andWhere("v.letnik", ">=", req.body.dodatno.letnik);
        }
        if (req.body.dodatno.tip) {
            query.andWhere("t.naziv", "=", req.body.dodatno.tip);
        }
    }

    let tip_tovora = req.body.tip_tovora;
    let teza_tovora;
    switch (tip_tovora) {
        case "posamezni izdelki":
            let izdelki = req.body.izdelki;
            teza_tovora = 0;
            let volumen = 0;
            for (const izdelek of izdelki) {
                teza_tovora += izdelek.teza * izdelek.kolicina;
                volumen += izdelek.dolzina * izdelek.visina * izdelek.sirina;
            }
            query.andWhere("v.maks_teza_tovora", ">=", teza_tovora)
                .whereRaw("v.maks_dolzina_tovora * v.maks_sirina_tovora * v.maks_visina_tovora >= ?", [volumen])
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
            break;
        case "palete":
            let st_palet = req.body.st_palet;
            teza_tovora = req.body.teza_palete * st_palet;
            query.andWhere("v.maks_teza_tovora", ">=", teza_tovora)
                .andWhere("v.maks_st_palet", ">=", st_palet)
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
            break;
        case "razsut tovor":
            let volumen_tovora = req.body.volumen_tovora;
            teza_tovora = req.body.teza_tovora;
            query.andWhere("v.maks_teza_tovora", ">=", teza_tovora)
                .andWhere("v.maks_volumen_tovora", ">=", volumen_tovora)
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
            break;
        default:
            res.sendStatus(400);
    }
});

router.get('/', auth, (req, res, next) => {
    knex.from('Vozilo as v')
        .select([
            "v.id",
            "letnik",
            "registerska",
            "model",
            "maks_teza_tovora",
            "aktivno",
            "zasedeno",
            "potrdilo_izpravnosti",
            "maks_volumen_tovora",
            "maks_dolzina_tovora",
            "maks_sirina_tovora",
            "maks_visina_tovora",
            "maks_st_palet",
            "t.naziv as tip_vozila",
            "z.naziv as znamka",
            "c.cena_na_km"])
        .where({
            "idUporabnik": req.session.user_id,
            "deleted": 0,
            "c.datum_od": (qb) => {
                qb.from("Cenik as c2").max("c2.datum_od").whereRaw("c2.idVozilo = v.id", []);
            }
        })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.get('/:id', auth, (req, res, next) => {
    knex.from('Vozilo as v')
        .select([
            "v.id",
            "letnik",
            "registerska",
            "model",
            "maks_teza_tovora",
            "aktivno",
            "zasedeno",
            "potrdilo_izpravnosti",
            "maks_volumen_tovora",
            "maks_dolzina_tovora",
            "maks_sirina_tovora",
            "maks_visina_tovora",
            "maks_st_palet",
            "t.naziv as tip_vozila",
            "z.naziv as znamka",
            "c.cena_na_km"])
        .where({
            "idUporabnik": req.session.user_id,
            "v.id": req.params.id,
            "deleted": 0,
            "c.datum_od": (qb) => {
                qb.from("Cenik as c2").max("c2.datum_od").where({ "c2.idVozilo": req.params.id });
            }
        })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.post('/', auth, async (req, res, next) => {
    if (! await ZnamkaExists(req.body.znamka)) {
        await knex.into("Znamka")
            .insert([{ naziv: req.body.znamka }]);
    }

    let slika_name;
    if (req.files) {
        slika_name = `${uuidv4()}_${req.files.slika.name}`;
        fs.writeFileSync(path.join(__dirname, "..", "user_content", "images", slika_name), req.files.slika.data);
    }

    let volumen = null;
    let dolzina = null;
    let sirina = null;
    let visina = null;
    let stPalet = null;

    if (req.body.maks_volumen_tovora) {
        volumen = req.body.maks_volumen_tovora;
    }
    if (req.body.maks_dolzina_tovora) {
        dolzina = req.body.maks_dolzina_tovora;
    }
    if (req.body.maks_sirina_tovora) {
        sirina = req.body.maks_sirina_tovora;
    }
    if (req.body.maks_visina_tovora) {
        visina = req.body.maks_visina_tovora;
    }
    if (req.body.maks_st_palet) {
        stPalet = req.body.maks_st_palet;
    }

    knex.into("Vozilo")
        .insert([{
            letnik: req.body.letnik,
            registerska: req.body.registerska,
            model: req.body.model,
            maks_teza_tovora: req.body.maks_teza_tovora,
            potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
            slika: slika_name,
            maks_volumen_tovora: volumen,
            maks_dolzina_tovora: dolzina,
            maks_sirina_tovora: sirina,
            maks_visina_tovora: visina,
            maks_st_palet: stPalet,
            idUporabnik: req.session.user_id,
            idZnamka: (qb) => {
                qb.select("id").from("Znamka").where({ naziv: req.body.znamka });
            },
            idTip_vozila: (qb) => {
                qb.select("id").from("Tip_vozila").where({ naziv: req.body.tip_vozila });
            }
        }])
        .then((vozilo) => {
            if (vozilo.length != 0) {
                knex.into('Cenik')
                    .insert([{
                        cena_na_km: req.body.cena,
                        idVozilo: vozilo[0]
                    }])
                    .then(() => {
                        res.json({ message: "success" });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    });
            } else {
                res.sendStatus(500);
            }
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.put('/:id/edit', auth, async (req, res, next) => {
    let slika_name;
    if (req.files) {
        slika_name = `${uuidv4()}_${req.files.slika.name}`;
        fs.writeFileSync(path.join(__dirname, "..", "user_content", "images", slika_name), req.files.slika.data);
    }

    let volumen = null;
    let dolzina = null;
    let sirina = null;
    let visina = null;
    let stPalet = null;

    if (req.body.maks_volumen_tovora) {
        volumen = req.body.maks_volumen_tovora;
    }
    if (req.body.maks_dolzina_tovora) {
        dolzina = req.body.maks_dolzina_tovora;
    }
    if (req.body.maks_sirina_tovora) {
        sirina = req.body.maks_sirina_tovora;
    }
    if (req.body.maks_visina_tovora) {
        visina = req.body.maks_visina_tovora;
    }
    if (req.body.maks_st_palet) {
        stPalet = req.body.maks_st_palet;
    }

    let data = {
        letnik: req.body.letnik,
        registerska: req.body.registerska,
        model: req.body.model,
        maks_teza_tovora: req.body.maks_teza_tovora,
        potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
        slika: slika_name,
        maks_volumen_tovora: volumen,
        maks_dolzina_tovora: dolzina,
        maks_sirina_tovora: sirina,
        maks_visina_tovora: visina,
        maks_st_palet: stPalet
    }

    if (req.body.znamka) {
        if (! await ZnamkaExists(req.body.znamka)) {
            await knex.into("Znamka")
                .insert([{ naziv: req.body.znamka }]);
        }
        data.idZnamka = (qb) => {
            qb.select("id").from("Znamka").where({ naziv: req.body.znamka });
        };
    }

    if (req.body.tip_vozila) {
        data.idTip_vozila = (qb) => {
            qb.select("id").from("Tip_vozila").where({ naziv: req.body.tip_vozila });
        }
    }

    if (req.body.cena) {
        knex.into('Cenik')
            .insert([{
                cena_na_km: req.body.cena,
                idVozilo: req.params.id
            }])
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    }

    if (!emptyObject(data)) {
        knex("Vozilo")
            .update(data)
            .where({ idUporabnik: req.session.user_id, id: req.params.id })
            .then((data) => {
                res.json({ message: "success" });
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    } else {
        res.json({ message: "success" });
    }
});

router.put('/:id/active/:bool', auth, (req, res, next) => {
    knex('Vozilo')
        .update({
            aktivno: req.params.bool
        })
        .where({
            idUporabnik: req.session.user_id,
            id: req.params.id,
            deleted: 0
        })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.delete('/:id', auth, (req, res, next) => {
    knex('Vozilo')
        .update({ deleted: 1 })
        .where({
            idUporabnik: req.session.user_id,
            id: req.params.id
        })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.get('/:id/image', (req, res, next) => {
    knex.select("slika")
        .from('Vozilo')
        .where({ id: req.params.id })
        .then((data) => {
            let slika = data[0].slika || "no_image.jpg";
            res.sendFile(path.join(__dirname, "..", "user_content", "images", slika));
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

module.exports = router;

async function ZnamkaExists(naziv) {
    let znamka = await knex.from("Znamka as z")
        .select("z.id")
        .where({ naziv: naziv })
    return znamka.length != 0;
}

function emptyObject(obj) {
    for (let key in obj) {
        if (obj[key]) {
            return false;
        }
    }
    return true;
} 
