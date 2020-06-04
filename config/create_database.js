const path = require('path');
process.chdir(path.dirname(__dirname));
const knex = require('./database');
const bcrypt = require('bcryptjs');

create_database();

async function create_database() {
    await knex.schema.dropTableIfExists('Cenik')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Izdelek')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Ponudba')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Vozilo')
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

    await knex.schema.dropTableIfExists('Uporabnik')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Naslov')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Posta')
        .catch((err) => {
            console.log(err);
            throw err;
        });

    await knex.schema.dropTableIfExists('Tip_tovora')
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

        table.integer('idPosta').unsigned().references('id').inTable('Posta').notNullable();
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

        table.integer('idNaslov').unsigned().references('id').inTable('Naslov').notNullable();
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
        table.string('slika');
        table.boolean("deleted").notNullable().defaultTo(0)

        table.integer('idTip_vozila').unsigned().references('id').inTable('Tip_vozila').notNullable();
        table.integer('idZnamka').unsigned().references('id').inTable('Znamka').notNullable();
        table.integer('idUporabnik').unsigned().references('id').inTable('Uporabnik').notNullable();
    })
        .then(() => console.log("Created table: Vozilo"))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('Cenik', (table) => {
        table.increments('id');
        table.float('cena_na_km').notNullable();
        table.timestamp('datum_od').defaultTo(knex.fn.now());

        table.integer('idVozilo').unsigned().references('id').inTable('Vozilo').notNullable();
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

        table.integer('idVozilo').unsigned().references('id').inTable('Vozilo').notNullable();
        table.integer('idTip_tovora').unsigned().references('id').inTable('Tip_tovora').notNullable();
        table.integer('naslov_nalozitve_idNaslov').unsigned().references('id').inTable('Naslov').notNullable();
        table.integer('naslov_dostave_idNaslov').unsigned().references('id').inTable('Naslov').notNullable();
        table.integer('idUporabnik').unsigned().references('id').inTable('Uporabnik').notNullable();
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

        table.integer('idPonudba').unsigned().references('id').inTable('Ponudba').notNullable();
    })
        .then(() => console.log("Created table: Izdelek"))
        .catch((err) => { console.log(err); throw err });


    /*  ###################
        ### INSERT DATA ###
        ################### */
    const posta = [
        { kraj: 'Ljubljana', stevilka: '1000' },
        { kraj: 'Maribor', stevilka: '2000' },
        { kraj: 'Celje', stevilka: '3000' },
        { kraj: 'Kranj', stevilka: '4000' },
        { kraj: 'Nova Gorica', stevilka: '5000' },
        { kraj: 'Koper', stevilka: '6000' },
        { kraj: 'Novo mesto', stevilka: '8000' },
        { kraj: 'Murska Sobota', stevilka: '9000' }
    ]
    await knex('Posta').insert(posta)
        .then(() => console.log("Data inserted: Posta"))
        .catch((err) => { console.log(err); throw err });

    const naslov = [
        { ulica: 'Koroška cesta', stevilka: '46', idPosta: 1 },
        { ulica: 'Večna pot ', stevilka: '113', idPosta: 2 },
        { ulica: 'Titov trg', stevilka: '20a', idPosta: 3 },
        { ulica: 'Na Loko', stevilka: '2', idPosta: 4 },
        { ulica: 'Vrtna ulica', stevilka: '19', idPosta: 8 },
        { ulica: 'Trubarjeva ulica', stevilka: '1', idPosta: 3 },
        { ulica: 'Prečna ulica', stevilka: '13', idPosta: 2 },
        { ulica: 'Kajuhova ulica', stevilka: '28', idPosta: 5 },
        { ulica: 'Mladinska ulica', stevilka: '43', idPosta: 6 },
        { ulica: 'Šolska ulica', stevilka: '19', idPosta: 7 },
        { ulica: 'Erjavčeva ulica', stevilka: '5', idPosta: 5 },
        { ulica: 'Šmarješka cesta', stevilka: '42', idPosta: 7 },
        { ulica: 'Obzidna ulica', stevilka: '2', idPosta: 6 },
        { ulica: 'Čopova ulica', stevilka: '31', idPosta: 3 },
        { ulica: 'Poštna ulica', stevilka: '53', idPosta: 4 },
    ]
    await knex('Naslov').insert(naslov)
        .then(() => console.log("Data inserted: Naslov"))
        .catch((err) => { console.log(err); throw err });

    const uporabnik = [
        //Stranke:
        { ime: 'Janez', priimek: 'Novak', email: 'janez.novak@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 1 },
        { ime: 'Marko', priimek: 'Horvat', email: 'marko.horvat@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 4 },
        { ime: 'Irena', priimek: 'Kranjc', email: 'irena.kranjc@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 2 },
        { ime: 'Barbara', priimek: 'Potocnik', email: 'barbara.potocnik@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 3 },
        { ime: 'Aleš', priimek: 'Kovačič', email: 'ales.kovacic@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 7 },
        { ime: 'Nataša', priimek: 'Kovač', email: 'natasa.kovac@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 5 },
        { ime: 'Rok', priimek: 'Mlakar', email: 'rok.mlakar@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 8 },
        { ime: 'Vesna', priimek: 'Kralj', email: 'vesna.kralj@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 4 },
        { ime: 'Miha', priimek: 'Petek', email: 'miha.petek@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 6 },
        { ime: 'Majda', priimek: 'Medved', email: 'majda.medved@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 1 },
        { ime: 'Andrej', priimek: 'Cerar', email: 'andrej.cerar@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 5},
        { ime: 'Katarina', priimek: 'Kokalj', email: 'katarina.kokalj@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 3 },
        { ime: 'Ivan', priimek: 'Lešnik', email: 'ivan.lesnik@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 4 },
        { ime: 'Martina', priimek: 'Kolenc', email: 'martina.kolenc@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 8 },
        { ime: 'Anton', priimek: 'Jug', email: 'anton.jug@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 2 },
        //Podjetja
        {
            ime: 'Luka', priimek: 'Kos', email: 'prevozi123@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 2,
            naziv_podjetja: 'Prevozi123', davcna: 98567345, zacetek_delovanja: '2013-01-16', uspesnost_poslovanja: "EBITDA,ROA"
        },
        {
            ime: 'Tomaz', priimek: 'Bizjak', email: 'mi.vozimo@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 1,
            naziv_podjetja: 'Mi vozimo', davcna: 98567355, zacetek_delovanja: '2015-11-06', uspesnost_poslovanja: "ROE, ROR, EVA"
        },
        {
            ime: 'Petra', priimek: 'Kotnik', email: 'prevoz.nudim@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 3,
            naziv_podjetja: 'Prevoz nudim', davcna: 98573455, zacetek_delovanja: '2020-09-14', uspesnost_poslovanja: "EBITDA, EVA, ROR"
        },
        {
            ime: 'Eva', priimek: 'Zupanc', email: 'smrtnik.prevozi@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 4,
            naziv_podjetja: 'Smrtnik prevozi', davcna: 95673455, zacetek_delovanja: '2019-08-30', uspesnost_poslovanja: "EBITDA, ROA, EVA"
        },
        {
            ime: 'Matjaž', priimek: 'Rupnik', email: 'najdi.prevoz@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 7,
            naziv_podjetja: 'Najdi prevoz', davcna: 85673455, zacetek_delovanja: '2014-01-03', uspesnost_poslovanja: "EBITDA, ROA, EVA"
        },
        {
            ime: 'Urška', priimek: 'Lesjak', email: 'lesjak.nudim@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 2,
            naziv_podjetja: 'Ponudba prevoza Lesjak', davcna: 98567455, zacetek_delovanja: '2011-08-11', uspesnost_poslovanja: "EBITDA,ROA "
        },
        {
            ime: 'Boris', priimek: 'Pušnik', email: 'prevoznistvo.pusnik@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 8,
            naziv_podjetja: 'Prevozništvo Pušnik', davcna: 98673455, zacetek_delovanja: '2001-03-20', uspesnost_poslovanja: "ROE, ROR, EVA"
        },
        {
            ime: 'Špela', priimek: 'Logar', email: 'logar.prevozi@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 6,
            naziv_podjetja: 'Prevozno podjetje Logar', davcna: 985673455, zacetek_delovanja: '2012-01-02', uspesnost_poslovanja: "EBITDA, ROA, EVA"
        },
        /* Odvečna podjetja, za kasneje če še dodamo več vozil
        {
            ime: 'Simon', priimek: 'Jelen', email: 'prevozništvo.simon@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 5,
            naziv_podjetja: 'Prevozništvo Simon', davcna: 98563425, zacetek_delovanja: '2017-05-01', uspesnost_poslovanja: "EBITDA,ROA "
        },
        {
            ime: 'Vida', priimek: 'Hren', email: 'hren.prevozi@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 1,
            naziv_podjetja: 'Hren prevozi', davcna: 985653125, zacetek_delovanja: '2014-11-27', uspesnost_poslovanja: "ROE, ROR, EVA"
        },
        {
            ime: 'Rok', priimek: 'Primožič', email: 'primozic.logistics@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 3,
            naziv_podjetja: 'Primožič logistics', davcna: 17652348, zacetek_delovanja: '2007-12-31', uspesnost_poslovanja: "EBITDA, ROA, EVA"
        },
        {
            ime: 'Helena', priimek: 'Kocjančič', email: 'prevozi.koci@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 8,
            naziv_podjetja: 'Prevozi Koci', davcna: 96528375, zacetek_delovanja: '2018-02-21', uspesnost_poslovanja: "EBITDA,ROA "
        },
        {
            ime: 'Gregor', priimek: 'Ribič', email: 'riba.prevozi@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 3,
            naziv_podjetja: 'Prevozi in storitve Riba', davcna: 91735824, zacetek_delovanja: '2009-09-15', uspesnost_poslovanja: "EBITDA, ROA, EVA"
        },
        {
            ime: 'Dragica', priimek: 'Fras', email: 'avtoprevoznistvo.fras@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 6,
            naziv_podjetja: 'Avtoprevozništvo Fras', davcna: 54217652, zacetek_delovanja: '1999-05-12', uspesnost_poslovanja: "EBITDA,ROA "
        },
        {
            ime: 'Jure', priimek: 'Dolinar', email: 'jurcek.prevozi@mail.com', geslo: bcrypt.hashSync("test123", 10), idNaslov: 5,
            naziv_podjetja: 'Jurček prevozi', davcna: 76513428, zacetek_delovanja: '2000-06-19', uspesnost_poslovanja: "ROE, ROR, EVA"
        }
        */
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
        { naziv: 'Renault' },
        { naziv: 'Opel' },
        { naziv: 'Citroen' },
        { naziv: 'Volvo' },
        { naziv: 'Scania' },
        { naziv: 'Iveco' },
        { naziv: 'Hyundai' }

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
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 2000,
            maks_sirina_tovora: 1500,
            maks_visina_tovora: 1800,
            maks_st_palet: 2,
            idTip_vozila: 1,
            idZnamka: 3,
            idUporabnik: 16,
            slika: "transporter.jpg"
        },
        {
            letnik: "2016",
            registerska: 'LJ HF-653',
            model: "T HIGH",
            maks_teza_tovora: 3500,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_volumen_tovora: 200,
            idTip_vozila: 3,
            idZnamka: 4,
            idUporabnik: 16,
            slika: "t_high.jpg"
        },
        {
            letnik: "2017",
            registerska: 'MB HG-879',
            model: "Actros",
            maks_teza_tovora: 7000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 5000,
            maks_sirina_tovora: 2200,
            maks_visina_tovora: 2000,
            maks_st_palet: 8,
            idTip_vozila: 3,
            idZnamka: 1,
            idUporabnik: 17,
            slika: "actros.jpg"
        },
        {
            letnik: "2020",
            registerska: 'NM DF-245',
            model: "TGX",
            maks_teza_tovora: 7000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 7000,
            maks_sirina_tovora: 2200,
            maks_visina_tovora: 1800,
            maks_st_palet: 5,
            idTip_vozila: 3,
            idZnamka: 2,
            idUporabnik: 18,
            slika: "tgx.jpg"
        },
        {
            letnik: "2013",
            registerska: 'CE H5-3R1',
            model: "Trago",
            maks_teza_tovora: 4000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 7000,
            maks_sirina_tovora: 2000,
            maks_visina_tovora: 1900,
            maks_st_palet: 4,
            idTip_vozila: 2,
            idZnamka: 10,
            idUporabnik: 19,
            slika: "trago.jpg"
        },
        {
            letnik: "2013",
            registerska: 'KR EO-523',
            model: "Econic",
            maks_teza_tovora: 4500,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 8000,
            maks_sirina_tovora: 2400,
            maks_visina_tovora: 1800,
            maks_st_palet: 1,
            idTip_vozila: 4,
            idZnamka: 1,
            idUporabnik: 20,
            slika: "Econic.jpeg"
        },
        {
            letnik: "2019",
            registerska: 'MS OL-241',
            model: "Zafira",
            maks_teza_tovora: 1500,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 4000,
            maks_sirina_tovora: 1100,
            maks_visina_tovora: 1100,
            maks_st_palet: 2,
            idTip_vozila: 1,
            idZnamka: 5,
            idUporabnik: 21,
            slika: "zafira.jpg"
        },
        {
            letnik: "2019",
            registerska: 'LJ AO-130',
            model: "Jumper",
            maks_teza_tovora: 1000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 1000,
            maks_sirina_tovora: 1500,
            maks_visina_tovora: 1800,
            maks_st_palet: 2,
            idTip_vozila: 3,
            idZnamka: 6,
            idUporabnik: 22,
            slika: "jumper.jpg"
        },
        {
            letnik: "2018",
            registerska: 'KO LA-351',
            model: "Fe",
            maks_teza_tovora: 7000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 9000,
            maks_sirina_tovora: 4500,
            maks_visina_tovora: 300,
            maks_st_palet: 0,
            idTip_vozila: 2,
            idZnamka: 7,
            idUporabnik: 23,
            slika: "FE.jpg"
        },
        {
            letnik: "2015",
            registerska: 'NM KA-345',
            model: "S540",
            maks_teza_tovora: 6000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 9000,
            maks_sirina_tovora: 7000,
            maks_visina_tovora: 3000,
            maks_st_palet: 5,
            idTip_vozila: 3,
            idZnamka: 8,
            idUporabnik: 16,
            slika: "scania.jpg"
        },
        {
            letnik: "2017",
            registerska: 'CE PR-912',
            model: "Trakker",
            maks_teza_tovora: 3500,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 4000,
            maks_sirina_tovora: 6500,
            maks_visina_tovora: 3000,
            maks_st_palet: 0,
            idTip_vozila: 2,
            idZnamka: 9,
            idUporabnik: 16,
            slika: "trakker.jpg"
        },
        {
            letnik: "2019",
            registerska: 'MB ZA-741',
            model: "Atego",
            maks_teza_tovora: 7000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 3000,
            maks_sirina_tovora: 6000,
            maks_visina_tovora: 2800,
            maks_st_palet: 8,
            idTip_vozila: 3,
            idZnamka: 1,
            idUporabnik: 17,
            slika: "atego.jpg"
        },
        {
            letnik: "2018",
            registerska: 'LJ KA-271',
            model: "TGM",
            maks_teza_tovora: 6000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 5000,
            maks_sirina_tovora: 6500,
            maks_visina_tovora: 2800,
            maks_st_palet: 7,
            idTip_vozila: 3,
            idZnamka: 2,
            idUporabnik: 18,
            slika: "tgm.jpg"
        },
        {
            letnik: "2008",
            registerska: 'NG ZA-141',
            model: "T380",
            maks_teza_tovora: 4500,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 4000,
            maks_sirina_tovora: 2500,
            maks_visina_tovora: 3000,
            maks_st_palet: 6,
            idTip_vozila: 3,
            idZnamka: 4,
            idUporabnik: 18,
            slika: "t380.jpg"
        },
        {
            letnik: "2010",
            registerska: 'NG AP-121',
            model: "FH16",
            maks_teza_tovora: 4000,
            potrdilo_izpravnosti: "Potrdilo o tehničnem pregledu vozila",
            maks_dolzina_tovora: 3000,
            maks_sirina_tovora: 1000,
            maks_visina_tovora: 3000,
            maks_st_palet: 0,
            idTip_vozila: 4,
            idZnamka: 7,
            idUporabnik: 16,
            slika: "volvo.jpg"
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
        { cena_na_km: 1.2, datum_od: "2011-06-08", idVozilo: 5 },
        { cena_na_km: 3.2, datum_od: "2019-11-04", idVozilo: 6 },
        { cena_na_km: 2.6, datum_od: "2014-08-08", idVozilo: 7 },
        { cena_na_km: 2.1, datum_od: "2016-08-28", idVozilo: 8 },
        { cena_na_km: 3.5, datum_od: "2017-12-21", idVozilo: 9 },
        { cena_na_km: 1.2, datum_od: "2012-02-18", idVozilo: 10 },
        { cena_na_km: 1.8, datum_od: "2017-05-17", idVozilo: 11 },
        { cena_na_km: 2.6, datum_od: "2018-07-15", idVozilo: 12 },
        { cena_na_km: 3.2, datum_od: "2014-09-14", idVozilo: 13 },
        { cena_na_km: 1.7, datum_od: "2011-10-02", idVozilo: 14 },
        { cena_na_km: 1.9, datum_od: "2012-04-07", idVozilo: 15 }
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
        {
            cas_nalozitve: "2020-04-28 08:00:00",teza_tovora: 300, volumen_tovora: 100,
            idVozilo: 5, idTip_tovora: 3, naslov_nalozitve_idNaslov: 5, naslov_dostave_idNaslov: 1, idUporabnik: 7
        },
        {
            cas_nalozitve: "2020-04-07 08:00:00",st_palet: 4, teza_palet: 1600,
            idVozilo: 6, idTip_tovora: 1, naslov_nalozitve_idNaslov: 6, naslov_dostave_idNaslov: 11, idUporabnik: 8
        },
        {
            cas_nalozitve: "2020-05-06 22:00:00",
            idVozilo: 7, idTip_tovora: 3, naslov_nalozitve_idNaslov: 11, naslov_dostave_idNaslov: 12, idUporabnik: 3
        },
        {
            cas_nalozitve: "2019-01-31 11:00:00",teza_tovora: 5000, volumen_tovora: 4000,
            idVozilo: 8, idTip_tovora: 3, naslov_nalozitve_idNaslov: 15, naslov_dostave_idNaslov: 10, idUporabnik: 9
        },
        {
            cas_nalozitve: "2018-03-16 10:30:00",st_palet: 4, teza_palet: 1463,
            idVozilo: 9, idTip_tovora: 1, naslov_nalozitve_idNaslov: 12, naslov_dostave_idNaslov: 4, idUporabnik: 10
        },
        {
            cas_nalozitve: "2016-09-01 08:30:00",teza_tovora: 300, volumen_tovora: 250,
            idVozilo: 10, idTip_tovora: 3, naslov_nalozitve_idNaslov: 1, naslov_dostave_idNaslov: 6, idUporabnik: 12
        },
        {
            cas_nalozitve: "2017-11-26 09:00:00",
            idVozilo: 11, idTip_tovora: 3, naslov_nalozitve_idNaslov: 7, naslov_dostave_idNaslov: 2, idUporabnik: 6
        },
        {
            cas_nalozitve: "2018-02-18 06:00:00",st_palet: 2, teza_palet: 500,
            idVozilo: 12, idTip_tovora: 1, naslov_nalozitve_idNaslov: 8, naslov_dostave_idNaslov: 4, idUporabnik: 8
        },
        {
            cas_nalozitve: "2019-04-15 12:00:00",
            idVozilo: 13, idTip_tovora: 2, naslov_nalozitve_idNaslov: 9, naslov_dostave_idNaslov: 7, idUporabnik: 13
        },
        {
            cas_nalozitve: "2019-02-21 04:30:00",st_palet: 5, teza_palet: 1000,
            idVozilo: 14, idTip_tovora: 1, naslov_nalozitve_idNaslov: 12, naslov_dostave_idNaslov: 5, idUporabnik: 14
        },
        {
            cas_nalozitve: "2020-02-21 04:30:00",
            idVozilo: 15, idTip_tovora: 2, naslov_nalozitve_idNaslov: 10, naslov_dostave_idNaslov: 8, idUporabnik: 15
        },
    ]
    await knex('Ponudba').insert(ponudba)
        .then(() => console.log("Data inserted: Ponudba"))
        .catch((err) => { console.log(err); throw err });

    const izdelek = [
        { teza: 2, dolzina: 20, visina: 30, sirina: 20, kolicina: 3, idPonudba: 3 },
        { teza: 6, dolzina: 60, visina: 30, sirina: 20, kolicina: 10, idPonudba: 3 },
        { teza: 4, dolzina: 10, visina: 60, sirina: 20, kolicina: 12, idPonudba: 3 },
        { teza: 2, dolzina: 20, visina: 30, sirina: 20, kolicina: 3, idPonudba: 4 },
        { teza: 6, dolzina: 60, visina: 30, sirina: 20, kolicina: 10, idPonudba: 4 },
        { teza: 4, dolzina: 10, visina: 60, sirina: 20, kolicina: 12, idPonudba: 4 },
        { teza: 2, dolzina: 20, visina: 30, sirina: 20, kolicina: 3, idPonudba: 3},
        { teza: 6, dolzina: 60, visina: 30, sirina: 10, kolicina: 10, idPonudba: 3},
        { teza: 4, dolzina: 10, visina: 60, sirina: 20, kolicina: 12, idPonudba: 3},
        { teza: 2, dolzina: 20, visina: 30, sirina: 50, kolicina: 3, idPonudba: 4},
        { teza: 6, dolzina: 60, visina: 30, sirina: 60, kolicina: 1, idPonudba: 10},
        { teza: 6, dolzina: 20, visina: 70, sirina: 30, kolicina: 13, idPonudba: 1},
        { teza: 8, dolzina: 60, visina: 20, sirina: 20, kolicina: 10, idPonudba: 4},
        { teza: 2, dolzina: 30, visina: 40, sirina: 70, kolicina: 11, idPonudba: 5},
        { teza: 3, dolzina: 20, visina: 20, sirina: 10, kolicina: 7, idPonudba: 6},
        { teza: 4, dolzina: 70, visina: 30, sirina: 40, kolicina: 2, idPonudba: 8},
        { teza: 7, dolzina: 50, visina: 40, sirina: 50, kolicina: 8, idPonudba: 4},
        { teza: 1, dolzina: 10, visina: 50, sirina: 60, kolicina: 4, idPonudba: 3},
        { teza: 1, dolzina: 40, visina: 20, sirina: 70, kolicina: 8, idPonudba: 7},
        { teza: 6, dolzina: 50, visina: 10, sirina: 30, kolicina: 6, idPonudba: 8},
        { teza: 5, dolzina: 20, visina: 40, sirina: 60, kolicina: 4, idPonudba: 9}
    ]
    await knex('Izdelek').insert(izdelek)
        .then(() => console.log("Data inserted: Izdelek"))
        .catch((err) => { console.log(err); throw err });

    knex.destroy();
}
