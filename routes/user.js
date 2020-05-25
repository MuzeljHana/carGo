const knex = require('../config/database');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res, next) => {
    if (! await UserExists(req.body.email, req.body.davcna)) {
        const regex = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\S{6,20})$/; //Uppercase, lowercase, number, 6 - 20 characters
        if (!regex.test(req.body.geslo.trim())) {
            res.json({ message: "password format incorrect" });
            return;
        }
        if (! await PostaExists(req.body.kraj, req.body.postna_stevilka)) {
            await knex.into("Posta").insert([{ kraj: req.body.kraj, stevilka: req.body.postna_stevilka }]);
        }
        if (! await NaslovExists(req.body.ulica, req.body.hisna_stevilka)) {
            await knex.into("Naslov").insert([{
                ulica: req.body.ulica,
                stevilka: req.body.hisna_stevilka,
                idPosta: (qb) => {
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
            geslo: bcrypt.hashSync(req.body.geslo.trim(), 10),
            idNaslov: (qb) => {
                qb.from("Naslov").select("id").where({ ulica: req.body.ulica, stevilka: req.body.hisna_stevilka });
            }
        };
        if (req.body.naziv_podjetja) {
            let podjetje_data = {
                naziv_podjetja: req.body.naziv_podjetja,
                davcna: req.body.davcna,
                zacetek_delovanja: req.body.zacetek_delovanja,
                uspesnost_poslovanja: req.body.uspesnost_poslovanja
            }
            data = Object.assign(data, podjetje_data);
        }
        knex.into("Uporabnik")
            .insert([data])
            .then((data) => {
                res.json({ message: "success" });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send();
            });
    } else {
        res.json({ message: "User exists" });
    }
});

router.post("/login", (req, res, next) => {
    knex.from("Uporabnik")
        .select("id", "geslo", "naziv_podjetja")
        .where({ email: req.body.email })
        .then((user) => {
            if (user.length != 0 && bcrypt.compareSync(req.body.geslo.trim(), user[0].geslo)) {
                req.session.user_id = user[0].id;
                req.session.provider = user[0].naziv_podjetja;
                res.json({ message: "success" });
            } else {
                res.json({ message: "login failed" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get("/logout", (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.redirect("/");
    } else {
        res.json({ message: "user not logged in" });
    }
});

router.post('/editUser', (req, res, next) => {
    let data = {
        ime: req.body.ime,
        priimek: req.body.priimek,
        email: req.body.email,
        geslo: bcrypt.hashSync(req.body.geslo.trim(), 10),
        idNaslov: (qb) => {
            qb.from("Naslov").select("id").where({ ulica: req.body.ulica, stevilka: req.body.hisna_stevilka })
        }
    }
    if (req.body.naziv_podjetja) {
        let podjetje_data = {
            naziv_podjetja: req.body.naziv_podjetja,
            davcna: req.body.davcna,
            zacetek_delovanja: req.body.zacetek_delovanja,
            uspesnost_poslovanja: req.body.uspesnost_poslovanja
        }
        data = Object.assign(data, podjetje_data);
    }
    knex('Uporabnik')
        .update(data)
        .where({
            id: req.session.user_id,
        })
        .then((data) => {
            res.json({ message: "success" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
}));

module.exports = router;

async function PostaExists(kraj, stevilka) {
    let posta = await knex.from("Posta as p")
        .select("p.id")
        .where({ kraj: kraj })
        .orWhere({ stevilka: stevilka });
    return posta.length != 0;
}

async function NaslovExists(ulica, stevilka) {
    let naslov = await knex.from("Naslov as n")
        .select("n.id")
        .where({ ulica: ulica, "n.stevilka": stevilka })
        .join("Posta as p", { 'n.idPosta': 'p.id' });
    return naslov.length != 0;
}

async function UserExists(email, davcna) {
    let user = await knex.from("Uporabnik")
        .select("id")
        .where({ email: email })
        .orWhere({ davcna: davcna || 0 });
    return user.length != 0;
}
