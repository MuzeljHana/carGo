const path = require('path');
process.chdir(path.dirname(__dirname));
const knex = require('./database');

create_database();

async function create_database() {
    await knex.schema.dropTableIfExists('Posta')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Naslov')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Uporabnik')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Vozilo')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Cenik')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Ponudba')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Tip_vozila')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Znamka')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Tip_tovora')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Izdelek')
        .catch((err) => {
            console.log(err);
            throw err;
        });


    /*  #####################
        ### CREATE TABLES ###
        ##################### */
    await knex.schema.createTable('Posta', (table) => {
        table.increments('id');
        table.string('kraj').notNullable();
        table.string('stevilka').notNullable();
    })
        .then(() => console.log("Created table: Posta"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Naslov', (table) => {
        table.increments('id');
        table.string('ulica').notNullable();
        table.string('stevilka').notNullable();

        table.integer('idPosta').references('id').inTable('Posta');
    })
        .then(() => console.log("Created table: Naslov"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Uporabnik', (table) => {
        table.increments('id');
        table.string('ime').notNullable();
        table.string('priimek').notNullable();
        table.string('email').notNullable();
        table.string('geslo').notNullable();
        table.string('naziv_podjetja');
        table.string('davcna');
        table.date('zacetek_delovanja');
        table.string('uspesnost_poslovanja');

        table.integer('idNaslov').references('id').inTable('Naslov');
    })
        .then(() => console.log("Created table: Uporabnik"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Tip_vozila', (table) => {
        table.increments('id');
        table.string('naziv').notNullable();
    })
        .then(() => console.log("Created table: Tip_vozila"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Znamka', (table) => {
        table.increments('id');
        table.string('naziv').notNullable();
    })
        .then(() => console.log("Created table: Znamka"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Vozilo', (table) => {
        table.increments('id');
        table.string('letnik').notNullable();
        table.string('registerska').notNullable();
        table.string('model').notNullable();
        table.integer('maks_teza_tovora').notNullable();
        table.string('potrdilo_izpravnosti').notNullable();
        table.boolean('aktivno').notNullable().defaultTo(1);
        table.boolean('zasedeno').notNullable().defaultTo(0);
        table.integer('maks_volumen_tovora');
        table.integer('maks_dolzina_tovora');
        table.integer('maks_sirina_tovora');
        table.integer('maks_visina_tovora');
        table.integer('maks_st_palet');

        table.integer('idTip_vozila').references('id').inTable('Tip_vozila');
        table.integer('idZnamka').references('id').inTable('Znamka');
        table.integer('idUporabnik').references('id').inTable('Uporabnik');
    })
        .then(() => console.log("Created table: Vozilo"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Cenik', (table) => {
        table.increments('id');
        table.float('cena_na_km').notNullable();
        table.date('datum_od').defaultTo(knex.fn.now());
        table.date('datum_do');

        table.integer('idVozilo').references('id').inTable('Vozilo');
    })
        .then(() => console.log("Created table: Znamka"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Tip_tovora', (table) => {
        table.increments('id');
        table.string('naziv').notNullable();
    })
        .then(() => console.log("Created table: Tip_tovora"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Ponudba', (table) => {
        table.increments('id');
        table.dateTime('cas_nalozitve').notNullable();
        table.string('status').defaultTo("cakanje potrditve");
        table.timestamp('cas_ponudbe').defaultTo(knex.fn.now());
        table.string('pripombe');
        table.integer('teza_tovora');
        table.integer('volumen_tovora');
        table.integer('st_palet');
        table.integer('teza_palet');

        table.integer('idVozilo').references('id').inTable('Vozilo');
        table.integer('idTip_tovora').references('id').inTable('Tip_tovora');
        table.integer('naslov_nalozitve_idNaslov').references('id').inTable('Naslov');
        table.integer('naslov_dostave_idNaslov').references('id').inTable('Naslov');
        table.integer('idUporabnik').references('id').inTable('Uporabnik');
    })
        .then(() => console.log("Created table: Ponudba"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Izdelek', (table) => {
        table.increments('id');
        table.integer('teza').notNullable();
        table.integer('dolzina').notNullable();
        table.integer('visina').notNullable();
        table.integer('sirina').notNullable();
        table.integer('kolicina').notNullable();

        table.integer('idPonudba').references('id').inTable('Ponudba');
    })
        .then(() => console.log("Created table: Izdelek"))
        .catch((err) => { console.log(err); throw err });


    /*  ###################
        ### INSERT DATA ###
        ################### */
    const posta = [
        { kraj: 'Maribor', stevilka: '2000' },
        { kraj: 'Ljubljana', stevilka: '1000' },
        { kraj: 'Celje', stevilka: '3000' },
        { kraj: 'Koper', stevilka: '6000' }
    ]
    await knex('Posta').insert(posta)
        .then(() => console.log("Data inserted: Posta"))
        .catch((err) => { console.log(err); throw err });

    const naslov = [
        { ulica: 'Koroška cesta', stevilka: '46' },
        { ulica: 'Večna pot ', stevilka: '113' },
        { ulica: 'Titov trg', stevilka: '20a' },
        { ulica: 'MNa Loko', stevilka: '2' },
    ]
    await knex('Naslov').insert(naslov)
        .then(() => console.log("Data inserted: Naslov"))
        .catch((err) => { console.log(err); throw err });

    const uporabnik = [
        { ime: 'Janez', priimek: 'Novak', email: 'janez.novak@mail.com', geslo: "test123", idNaslov: 1 },
        { ime: 'Controleum', priimek: 'Controleum', email: 'controleum@mail.com', geslo: "test123", idNaslov: 2 },
        { ime: 'Zidnak', priimek: 'Zidnak', email: 'zidnak@mail.com', geslo: "test123", idNaslov: 2 },
        { ime: 'Avortium', priimek: 'Avortium', email: 'avortium@mail.com', geslo: "test123", idNaslov: 2 },
        {
            ime: 'Janez', priimek: 'Novak', email: 'prevozi123@mail.com', geslo: "test123", idNaslov: 2,
            naziv_podjetja: 'Prevozi 123', davcna: 985673455, zacetek_delovanja: '2013-01-16', uspesnost_poslovanja: "neko poročilo"
        },
        {
            ime: 'Janez', priimek: 'Novak', email: 'mi.vozimo@mail.com', geslo: "test123", idNaslov: 1,
            naziv_podjetja: 'Mi vozimo', davcna: 985673455, zacetek_delovanja: '2015-11-06', uspesnost_poslovanja: "neko poročilo"
        },
        {
            ime: 'Janez', priimek: 'Novak', email: 'prevoz.nudim@mail.com', geslo: "test123", idNaslov: 3,
            naziv_podjetja: 'Prevoz nudim', davcna: 985673455, zacetek_delovanja: '2020-09-14', uspesnost_poslovanja: "neko poročilo"
        },
        {
            ime: 'Janez', priimek: 'Novak', email: 'smrtnik.prevozi@mail.com', geslo: "test123", idNaslov: 3,
            naziv_podjetja: 'Smrtnik prevozi', davcna: 985673455, zacetek_delovanja: '2019-08-30', uspesnost_poslovanja: "neko poročilo"
        }
    ]
    await knex('Uporabnik').insert(uporabnik)
        .then(() => console.log("Data inserted: Uporabnik"))
        .catch((err) => { console.log(err); throw err });

    const tip_vozila = [
        { naziv: 'kombi' },
        { naziv: 'tovornjak razsut tovor' },
        { naziv: 'tovornjak blago' },
        { naziv: 'izredni prevoz' }
    ]
    await knex('Tip_vozila').insert(tip_vozila)
        .then(() => console.log("Data inserted: Tip_vozila"))
        .catch((err) => { console.log(err); throw err });

    const znamka = [
        { naziv: 'Mercedes' },
        { naziv: 'MAN' },
        { naziv: 'Volkswagen' },
        { naziv: 'Renault' }
    ]
    await knex('Znamka').insert(znamka)
        .then(() => console.log("Data inserted: Znamka"))
        .catch((err) => { console.log(err); throw err });

    const vozilo = [
        {
            letnik: "2005",
            registerska: 'MB FL-341',
            model: "Transporter",
            maks_teza_tovora: 3500,
            potrdilo_izpravnosti: "neko potrdilo",
            maks_dolzina_tovora: 2000,
            maks_sirina_tovora: 1500,
            maks_visina_tovora: 1800,
            maks_st_palet: 2,
            idTip_vozila: 1,
            idZnamka: 3,
            idUporabnik: 7
        },
        {
            letnik: "2009",
            registerska: 'LJ HF-653',
            model: "T HIGH",
            maks_teza_tovora: 3500,
            potrdilo_izpravnosti: "neko potrdilo",
            maks_volumen_tovora: 200,
            idTip_vozila: 2,
            idZnamka: 4,
            idUporabnik: 6
        },
        {
            letnik: "2015",
            registerska: 'MB HG-879',
            model: "Actros",
            maks_teza_tovora: 7000,
            potrdilo_izpravnosti: "neko potrdilo",
            maks_dolzina_tovora: 5000,
            maks_sirina_tovora: 2200,
            maks_visina_tovora: 2000,
            maks_st_palet: 8,
            idTip_vozila: 3,
            idZnamka: 1,
            idUporabnik: 5
        },
        {
            letnik: "2020",
            registerska: 'NM DF-245',
            model: "TGX",
            maks_teza_tovora: 7000,
            potrdilo_izpravnosti: "neko potrdilo",
            maks_dolzina_tovora: 7000,
            maks_sirina_tovora: 2200,
            maks_visina_tovora: 1800,
            maks_st_palet: 5,
            idTip_vozila: 3,
            idZnamka: 2,
            idUporabnik: 5
        }
    ]
    await knex('Vozilo').insert(vozilo)
        .then(() => console.log("Data inserted: Vozilo"))
        .catch((err) => { console.log(err); throw err });


    const cenik = [
        { cena_na_km: 2.5, datum_od: "2019-08-30", idVozilo: 1 },
        { cena_na_km: 4.5, datum_od: "2019-08-30", idVozilo: 2 },
        { cena_na_km: 1.5, datum_od: "2019-08-30", idVozilo: 3 },
        { cena_na_km: 2.2, datum_od: "2019-08-30", idVozilo: 4 },
    ]
    await knex('Cenik').insert(cenik)
        .then(() => console.log("Data inserted: Cenik"))
        .catch((err) => { console.log(err); throw err });

    const tip_tovora = [
        { naziv: "palete" },
        { naziv: "posamezni izdelki" },
        { naziv: "razsut tovor" },
    ]
    await knex('Tip_tovora').insert(tip_tovora)
        .then(() => console.log("Data inserted: Tip_tovora"))
        .catch((err) => { console.log(err); throw err });

    const ponudba = [
        {
            cas_nalozitve: "2019-08-30 08:00:00", st_palet: 1, teza_palet: 233,
            idVozilo: 1, idTip_tovora: 1, naslov_nalozitve_idNaslov: 1, naslov_dostave_idNaslov: 2, idUporabnik: 1
        },
        {
            cas_nalozitve: "2020-05-18 10:00:00", teza_tovora: 500, volumen_tovora: 300,
            idVozilo: 2, idTip_tovora: 3, naslov_nalozitve_idNaslov: 2, naslov_dostave_idNaslov: 3, idUporabnik: 2
        },
        {
            cas_nalozitve: "2020-06-03 16:30:00",
            idVozilo: 3, idTip_tovora: 2, naslov_nalozitve_idNaslov: 3, naslov_dostave_idNaslov: 4, idUporabnik: 3
        },
        {
            cas_nalozitve: "2019-08-30 08:00:00",
            idVozilo: 4, idTip_tovora: 2, naslov_nalozitve_idNaslov: 4, naslov_dostave_idNaslov: 1, idUporabnik: 4
        },
    ]
    await knex('Ponudba').insert(ponudba)
        .then(() => console.log("Data inserted: Ponudba"))
        .catch((err) => { console.log(err); throw err });

    const izdelek = [
        { teza: 2, dolzina: 20, visina: 30, sirina: 20, kolicina: 3, idPonudba: 3},
        { teza: 6, dolzina: 60, visina: 30, sirina: 20, kolicina: 10, idPonudba: 3},
        { teza: 4, dolzina: 10, visina: 60, sirina: 20, kolicina: 12, idPonudba: 3},
        { teza: 2, dolzina: 20, visina: 30, sirina: 20, kolicina: 3, idPonudba: 4},
        { teza: 6, dolzina: 60, visina: 30, sirina: 20, kolicina: 10, idPonudba: 4},
        { teza: 4, dolzina: 10, visina: 60, sirina: 20, kolicina: 12, idPonudba: 4}
    ]
    await knex('Izdelek').insert(izdelek)
        .then(() => console.log("Data inserted: Izdelek"))
        .catch((err) => { console.log(err); throw err });

    knex.destroy();
}
