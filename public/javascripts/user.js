$(document).ready(function() {
    updateData();
});

$("#edit").click (function() {
    let ime = document.getElementById('i_ime_uredi').value;
    let priimek = document.getElementById('i_priimek_uredi').value;
    let email = document.getElementById('i_email_uredi').value;
    let geslo = document.getElementById('i_geslo_uredi').value;
    let staro_geslo = document.getElementById('staro_geslo').value;
    let ulica = document.getElementById('ulica_uredi').value 
    let hisna_st = document.getElementById('hisna_st_uredi').value;
    let kraj = document.getElementById('kraj_uredi').value;
    let postna_st = document.getElementById('postna_st_uredi').value;
    let naziv_podjetja;
    let davcna;
    let zacetek_delovanja;
    let uspesnost_poslovanja;
    if ($('#naziv_podjetja_uredi').length != 0) {
        naziv_podjetja = document.getElementById('naziv_podjetja_uredi').value;
        davcna = document.getElementById('davcna').value;
        zacetek_delovanja = document.getElementById('zacetek_delovanja_uredi').value;
        uspesnost_poslovanja = document.getElementById('uspesnost_poslovanja_uredi').value;
    }

    let podatkiUporabnika = {
        'ime': ime,
        'priimek': priimek,
        'email': email,
        'geslo': geslo,
        'staro_geslo': staro_geslo,
        'ulica': ulica,
        'hisna_st': hisna_st,
        'kraj': kraj,
        'postna_st': postna_st,
        'naziv_podjetja': naziv_podjetja,
        'davcna': davcna,
        'zacetek_delovanja': zacetek_delovanja,
        'uspesnost_poslovanja': uspesnost_poslovanja
    }
 
    fetch('http://localhost:3000/user/editUser', {
        method: 'POST',
        body: JSON.stringify(podatkiUporabnika),
        headers: {
            'content-type': 'application/json'
        }
    }).then((response) => {
        updateData();
        console.log("User successfully edited!");
    });
});

function updateData() {
    $.ajax({
        method: "get",
        url: "/user/",
        dataType: "json"
    })
    .done(function (data) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let uporabnik = data[i];
                if (uporabnik.zacetek_delovanja) {
                    let zacetek_delovanja = uporabnik.zacetek_delovanja.slice(0, 10);
                    if ($("#zacetek_delovanja_uredi").length != 0) {
                        if ($("#zacetek_delovanja_uredi").val(zacetek_delovanja)) {
                            $("#zacetek_delovanja_uredi").focus();
                        }
                    }
                }
                if ($("#i_priimek_uredi").val(uporabnik.priimek)) {
                    $("#i_priimek_uredi").focus();
                }
                /*if ($("#i_postna_stevilka_uredi").val(uporabnik.po)) {
                    $("#i_postna_stevilka_uredi").focus();
                }
                if ($("#i_kraj_uredi").val(uporabnik.geslo)) {
                    $("#i_kraj_uredi").focus();
                }
                if ($("#i_ulica_uredi").val(uporabnik.ulica)) {
                    $("#i_ulica_uredi").focus();
                }
                if ($("#i_hisna_stevilka_uredi").val(uporabnik.naziv_podjetja)) {
                    $("#i_hisna_stevilka_uredi").focus();
                }
                */
                if ($("#davcna").length != 0) {
                    if ($("#davcna").val(uporabnik.davcna)) {
                        $("#davcna").focus();
                    }
                }
                if ($("#naziv_podjetja_uredi").length != 0) {
                    if ($("#naziv_podjetja_uredi").val(uporabnik.naziv_podjetja)) {
                        $("#naziv_podjetja_uredi").focus();
                    }
                }
                if ($("#uspesnost_poslovanja_uredi").length != 0) {
                    if ($("#uspesnost_poslovanja_uredi").val(uporabnik.uspesnost_poslovanja)) {
                        $("#uspesnost_poslovanja_uredi").focus();
                    }
                }
                if ($("#i_email_uredi").val(uporabnik.email)) {
                    $("#i_email_uredi").focus();
                }
                if ($("#i_ime_uredi").val(uporabnik.ime)) {
                    $("#i_ime_uredi").focus();
                }
                window.scrollTo(0,0);
                break;
            }        
        }
    });  
}
