const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.post('/editVehicle', async(req, res, next) => {
    try {
        let prevozno_podjetjeData = {
            naziv: req.body.nazivPrevoznega_podjetja,
            davcna_st: req.body.davcna_stPrevoznega_podjetja,
            zacetek_delovanja: req.body.zacetek_delovanjaPrevoznega_podjetja,
            uspesnost_poslovanja: req.body.uspesnost_poslovanjaPrevoznega_podjetja,
            tk_naslov: req.body.idNaslov
        };
        let tabelaPrevoznega_podjetja = await new Podjetje().save(prevozno_podjetjeData)
        
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
});

module.exports = router;