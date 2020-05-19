const knex = require('../config/database');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res, next) => {
    let posta = await knex.from("Posta as p")
                        .select("p.id")
                        .where({ kraj: req.body.kraj })
                        .orWhere({ stevilka: req.body.postna_stevilka });
    if (posta.length == 0) {
        await knex.into("Posta").insert([{ kraj: req.body.kraj, stevilka: req.body.postna_stevilka }]);
    }
    let naslov = await knex.from("Naslov as n")
                        .select("n.id")
                        .where({ ulica: req.body.ulica, "n.stevilka": req.body.hisna_stevilka })
                        .join("Posta as p", { 'n.idPosta': 'p.id' });
    if (naslov.length == 0) {
        await knex.into("Naslov").insert([{ 
                ulica: req.body.ulica, 
                stevilka: req.body.hisna_stevilka, 
                idPosta:  (qb) => {
                    qb.from("Posta")
                        .select("id")
                        .where({ kraj: req.body.kraj })
                        .orWhere({ stevilka: req.body.postna_stevilka });
                }
            }]);
    }
    let data = {
        ime: req.body.ime,
        priimek: req.body.priimek,
        email: req.body.email,
        geslo: bcrypt.hashSync(req.body.geslo, 10),
        idNaslov: (qb) => {
            qb.from("Naslov").select("id").where({ ulica: req.body.ulica, stevilka: req.body.hisna_stevilka });
        }
    };
    if (req.body.naziv_podjetja) {
        data.naziv_podjetja = req.body.naziv_podjetja;
        data.davcna = req.body.davcna;
        data.zacetek_delovanja = req.body.zacetek_delovanja;
        data.uspesnost_poslovanja = req.body.uspesnost_poslovanja;
    }
    let user = await knex.from("Uporabnik")
                        .select("id")
                        .where({ email: req.body.email })
                        .orWhere({ davcna: req.body.davcna || 0 });
    if (user.length == 0) {
        knex.into("Uporabnik")
        .insert([data])
        .then((data) => {
            res.send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
    } else {
        res.json({ "message": "User exists" });
    }
});

router.post("/login", (req, res, next) => {
    knex.from("Uporabnik")
        .select("id", "geslo")
        .where({ email: req.body.email })
        .then((user) => {
            if (user.length != 0 && bcrypt.compareSync(req.body.geslo, user[0].geslo)) {
                req.session.user_id = user[0].id;
                res.send();
            } else {
                res.json({ "message": "login failed" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
