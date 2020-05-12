var knex = require('knex')({
    client: 'mysql',
    connection: {
        host:   '127.0.0.1',
        user:   'root',
        password:   'geslo123',
        database:   'cargo'
    }
});

async function baza(){
    await knex.schema.dropTableIfExists('posta')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('naslov')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('prevozno_podjetje')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('tip_prevoza')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('znamka')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('letnik')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('prevozno_sredstvo')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('destinacija')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('tip_tovora')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('tovor')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('termin')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('cenik')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('tip_iskalca')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('iskalec_prevoza')
    .catch((err) => {console.log(err); throw err});
    await knex.schema.dropTableIfExists('tovor_has_iskalec_prevoza')
    .catch((err) => {console.log(err); throw err});
//-----CREATE
    await knex.schema.createTable('posta', (table) => {
        table.increments('id');
        table.string('kraj').notNullable().unique;
        table.string('postna_st').notNullable().unique;
    }).then(() => console.log("posta tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('naslov', (table) => {
        table.increments('id');
        table.string('ulica').notNullable()
        table.string('hisna_st').notNullable()
        
        table.integer('tk_posta').references('id').inTable('posta')
    }).then(() => console.log("naslov tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('prevozno_podjetje', (table) => {
        table.increments('id');
        table.string('naziv').notNullable()
        table.integer('davcna_st').notNullable()
        table.date('zacetek_delovanja').notNullable()
        table.boolean('uspesnost_poslovanja').notNullable()
        
        table.integer('tk_naslov').references('id').inTable('naslov')
    }).then(() => console.log("prevozno_podjetje tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('tip_prevoza', (table) => {
        table.increments('id');
        table.enum('naziv',['kombi','tovornjak razsut tovor','tovornjak blago','izredni prevoz']).notNullable() 
    }).then(() => console.log("tip_prevoza tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('letnik', (table) => {
        table.increments('id');
        table.integer('naziv').notNullable().unique()
    }).then(() => console.log("letnik tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('znamka', (table) => {
        table.increments('id');
        table.string('naziv').notNullable().unique()
    }).then(() => console.log("znamka tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('prevozno_sredstvo', (table) => {
        table.increments('id');
        table.string('registracijska_st').notNullable()
        table.decimal('max_teza', [8], [2]).notNullable()
        table.decimal('cena', [4], [2]).notNullable()
        table.boolean('potrdilo_izpravnosti').notNullable()
        table.boolean('aktivnost').notNullable()
        table.boolean('zasedenost').notNullable()
        table.decimal('volumen', [4], [2])
        table.decimal('dolzina', [4], [2])
        table.decimal('sirina', [4], [2])
        table.decimal('visina', [4], [2])
        table.integer('st_palet')

        table.integer('tk_prevozno_podjetje').references('id').inTable('prevozno_podjetje')
        table.integer('tk_tip_prevoza').references('id').inTable('tip_prevoza')
        table.integer('tk_znamka').references('id').inTable('znamka')
        table.integer('tk_letnik').references('id').inTable('letnik')
    }).then(() => console.log("prevozno_sredstvo tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('destinacija', (table) => {
        table.increments('id');
        
        table.integer('tk_naslov').references('id').inTable('naslov')
    }).then(() => console.log("destinacija tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('tip_tovora', (table) => {
        table.increments('id');
        table.enum('naziv',['razsut tovor','polizdelek','izdelek']).notNullable() 
    }).then(() => console.log("tip_tovora tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('tovor', (table) => {
        table.increments('id');
        table.string('naziv').notNullable()
        table.decimal('volumen')
        table.decimal('dolzina')
        table.decimal('sirina')
        table.decimal('visina')
        table.decimal('teza')
        table.integer('st_palet')

        table.integer('tk_tip_tovora').references('id').inTable('tip_tovora')
    }).then(() => console.log("tovor tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('termin', (table) => {
        table.increments('id');
        table.date('datum_nalaganja').notNullable()
        table.date('datum_dostave').notNullable()

        table.integer('tk_tovor').references('id').inTable('tovor')
        table.integer('tk_naslov').references('id').inTable('naslov')
        table.integer('tk_destinacija').references('id').inTable('destinacija')
        table.integer('tk_prevozno_sredstvo').references('id').inTable('prevozno_sredstvo')
    }).then(() => console.log("termin tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('cenik', (table) => {
        table.increments('id');
        table.decimal('znesek').notNullable()

        table.integer('tk_termin').references('id').inTable('termin')
    }).then(() => console.log("cenik tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('tip_iskalca', (table) => {
        table.increments('id');
        table.enum('naziv',['fizicna oseba', 'podjetje']).notNullable() 
    }).then(() => console.log("tip_iskalca tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('iskalec_prevoza', (table) => {
        table.increments('id');
        table.string('naziv').notNullable()
        table.integer('davcna_st').notNullable().unique()

        table.integer('tk_naslov').references('id').inTable('naslov')
        table.integer('tk_tip_iskalca').references('id').inTable('tip_iskalca')
    }).then(() => console.log("iskalec_prevoza tabela narejena."))
    .catch((err) => {console.log(err); throw err});
    await knex.schema.createTable('tovor_has_iskalec_prevoza', (table) => {
        table.increments('id');
        table.date('datum_od').notNullable()
        table.date('datum_do')
    
        table.integer('tk_tovor').references('id').inTable('tovor')
        table.integer('tk_iskalec_prevoza').references('id').inTable('iskalec_prevoza')
    }).then(() => console.log("tovor_has_iskalec_prevoza tabela narejena."))
    .catch((err) => {console.log(err); throw err});
//-----INSERT   
    const postni_pod = [
        {kraj: 'Maribor', postna_st: '2000'},
        {kraj: 'Ljubljana', postna_st: '1000'},
        {kraj: 'Celje', postna_st: '3000'},
        {kraj: 'Koper', postna_st: '6000'}
    ]
    await knex('posta').insert(postni_pod)
    .then(() => console.log("Postni podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const naslov_pod = [
        {ulica: 'Koroška cesta', hisna_st: '46'},
        {ulica: 'Večna pot ', hisna_st: '113'},
        {ulica: 'Titov trg', hisna_st: '20a'},
        {ulica: 'MNa Loko', hisna_st: '2'},
    ]
    await knex('naslov').insert(naslov_pod)
    .then(() => console.log("Naslovni podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const p_podjetje_pod = [
        {naziv: 'Prevozi 123', davcna_st: 985673455, zacetek_delovanja:'2013-01-16',uspesnost_poslovanja: true, tk_naslov: 2},
        {naziv: 'Mi vozimo', davcna_st: 746565456, zacetek_delovanja:'2015-11-06',uspesnost_poslovanja: true, tk_naslov: 1},
        {naziv: 'Prevoz nudim', davcna_st: 867845673, zacetek_delovanja:'2020-09-14',uspesnost_poslovanja: true, tk_naslov: 3},
        {naziv: 'Smrtnik prevozi', davcna_st: 348346564, zacetek_delovanja:'2019-08-30',uspesnost_poslovanja: true, tk_naslov: 4}
    ]
    await knex('prevozno_podjetje').insert(p_podjetje_pod)
    .then(() => console.log("Podjetni podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const t_prevoz_pod = [
        {naziv: 'kombi'},
        {naziv: 'tovornjak razsut tovor'},
        {naziv: 'tovornjak blago'},
        {naziv: 'izredni prevoz'}
    ]
    await knex('tip_prevoza').insert(t_prevoz_pod)
    .then(() => console.log("Tip prevoza podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const letnik_pod = [
        {naziv: 2008},
        {naziv: 2006},
        {naziv: 2010},
        {naziv: 2016}
    ]
    await knex('letnik').insert(letnik_pod)
    .then(() => console.log("Letnik podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const znamka_pod = [
        {naziv: 'Mercedes'},
        {naziv: 'MAN'},
        {naziv: 'Volkswagen'},
        {naziv: 'Renault'}
    ]
    await knex('znamka').insert(znamka_pod)
    .then(() => console.log("Znamka podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const p_sredstvo_pod = [
        {registracijska_st: 'MB 1234L1', max_teza: 3500.00, cena: 2.5, potrdilo_izpravnosti: true, aktivnost:true,
        zasedenost: false, dolzina: 5.2, sirina: 2.2, visina: 1.8,tk_prevozno_podjetje:3, tk_tip_prevoza:1, tk_znamka: 3, tk_letnik: 4},
        {registracijska_st: 'LJ 346h3f', max_teza: 3500.00, cena: 4.5, potrdilo_izpravnosti: true, aktivnost:true, zasedenost:false,
        volumen: 200.50, tk_prevozno_podjetje: 2,  tk_tip_prevoza: 2, tk_znamka: 4, tk_letnik:2},
        {registracijska_st: 'MB H45RGR', max_teza: 7000.00, cena: 1.5, potrdilo_izpravnosti: true, aktivnost:true, zasedenost:false,
        st_palet: 8, tk_prevozno_podjetje: 1,  tk_tip_prevoza: 3, tk_znamka: 1, tk_letnik:1},
        {registracijska_st: 'NM 342H45', max_teza: 5000.00, cena: 2.2, potrdilo_izpravnosti: true, aktivnost:true, zasedenost:false,
        st_palet: 6, tk_prevozno_podjetje: 1,  tk_tip_prevoza: 3, tk_znamka: 2, tk_letnik:3}
    ]
    await knex('prevozno_sredstvo').insert(p_sredstvo_pod)
    .then(() => console.log("Prevozno_sredstvo podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const destinacija_pod = [
        {tk_naslov: 2},
        {tk_naslov: 3},
        {tk_naslov: 4},
        {tk_naslov: 1}
    ]
    await knex('destinacija').insert(destinacija_pod)
    .then(() => console.log("Destinacija podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const t_tovor_pod = [
        {naziv: 'razsut tovor'},
        {naziv: 'polizdelek'},
        {naziv: 'izdelek'}
    ]
    await knex('tip_tovora').insert(t_tovor_pod)
    .then(() => console.log("Tip_tovora podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const tovor_pod = [
        {naziv: 'zabojniki', st_palet:4, teza:60.0, tk_tip_tovora:3},
        {naziv: 'omara',dolzina: 0.5, sirina:2.0, visina:2.5, teza:10.0, tk_tip_tovora:3},
        {naziv: 'pesek', volumen: 200, teza: 800.0, tk_tip_tovora:1},
        {naziv: 'žakli', st_palet:3, teza: 120.0, tk_tip_tovora:2}
    ]
    await knex('tovor').insert(tovor_pod)
    .then(() => console.log("Tovor podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const termin_pod = [
        {datum_nalaganja: '2020-02-14', datum_dostave:'2020-02-15', tk_tovor: 3, tk_naslov:1, tk_destinacija:1, tk_prevozno_sredstvo:2},
        {datum_nalaganja: '2020-01-22', datum_dostave:'2020-01-22', tk_tovor: 2, tk_naslov:1, tk_destinacija:1, tk_prevozno_sredstvo:1},
        {datum_nalaganja: '2020-05-16', datum_dostave:'2020-05-17', tk_tovor: 1, tk_naslov:1, tk_destinacija:1, tk_prevozno_sredstvo:3},
        {datum_nalaganja: '2020-08-27', datum_dostave:'2020-08-27', tk_tovor: 4, tk_naslov:1, tk_destinacija:1, tk_prevozno_sredstvo:4}
    ]
    await knex('termin').insert(termin_pod)
    .then(() => console.log("Termin podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const cenik_pod = [
        {znesek: 130.00, tk_termin:1},
        {znesek: 160.57, tk_termin:2},
        {znesek: 70.61, tk_termin:3},
        {znesek: 210.52, tk_termin:4}
    ]
    await knex('cenik').insert(cenik_pod)
    .then(() => console.log("Cenik podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const t_iskalec_pod = [
        {naziv: 'fizicna oseba'},
        {naziv: 'podjetje'}
    ]
    await knex('tip_iskalca').insert(t_iskalec_pod)
    .then(() => console.log("Tip_iskalca podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const iskalec_p_pod = [
        {naziv: 'Janez Novak', davcna_st:985673452, tk_naslov:1, tk_tip_iskalca:1},
        {naziv: 'Controleum', davcna_st: 985673454, tk_naslov:3, tk_tip_iskalca:2},
        {naziv: 'Zidnak', davcna_st: 985673450, tk_naslov:4, tk_tip_iskalca:2},
        {naziv: 'Avortium', davcna_st: 985673451, tk_naslov:2, tk_tip_iskalca:2},
    ]
    await knex('iskalec_prevoza').insert(iskalec_p_pod)
    .then(() => console.log("Iskalec_prevoza podatki vstavljeni."))
    .catch((err) => {console.log(err); throw err});
    const t_h_i_p_pod = [
        {datum_od: '2013-01-16', tk_tovor:1, tk_iskalec_prevoza:1},
        {datum_od: '2013-01-16', tk_tovor:2, tk_iskalec_prevoza:2},
        {datum_od: '2013-01-16', tk_tovor:3, tk_iskalec_prevoza:3},
        {datum_od: '2013-01-16', tk_tovor:4, tk_iskalec_prevoza:4},
    ]
    await knex('tovor_has_iskalec_prevoza').insert(t_h_i_p_pod)
    .then(() => console.log("Tovor_has vstavljeni."))
    .catch((err) => {console.log(err); throw err});

    knex.destroy;
}

baza();