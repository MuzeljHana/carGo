$(document).ready(function () {
    updateData();
});

$("#edit").click(function () {
    $("#staro_geslo").removeClass("invalid");
    if (!($("#staro_geslo").val())) {
        $("#staro_geslo").addClass("invalid");
        return;
    }

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
        let date_arr = $("#zacetek_delovanja_uredi").val().split(".");
        zacetek_delovanja = `${date_arr[2]}-${date_arr[1]}-${date_arr[0]}`;
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

    fetch('/user/editUser', {
        method: 'POST',
        body: JSON.stringify(podatkiUporabnika),
        headers: {
            'content-type': 'application/json'
        }
    }).then((response) => {
        updateData();
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
                if (data.length != 0) {
                    let uporabnik = data[0];
                    if (uporabnik.zacetek_delovanja) {
                        let datum_full = new Date(uporabnik.zacetek_delovanja);
                        let datum = `${String(datum_full.getDate()).padStart(2, '0')}.${String(datum_full.getMonth()+1).padStart(2, '0')}.${datum_full.getFullYear()}`;
                        $("#zacetek_delovanja_uredi").val(datum);
                    }
                    $("#i_priimek_uredi").val(uporabnik.priimek);
                    $("#i_email_uredi").val(uporabnik.email);
                    $('#ulica_uredi').val(uporabnik.naslov);
                    $('#hisna_st_uredi').val(uporabnik.stevilka);
                    $('#kraj_uredi').val(uporabnik.kraj);
                    $('#postna_st_uredi').val(uporabnik.postna_st);
                    if ($("#davcna").length != 0) {
                        $("#davcna").val(uporabnik.davcna);
                    }
                    if ($("#naziv_podjetja_uredi").length != 0) {
                        $("#naziv_podjetja_uredi").val(uporabnik.naziv_podjetja);
                    }
                    if ($("#uspesnost_poslovanja_uredi").length != 0) {
                        $("#uspesnost_poslovanja_uredi").val(uporabnik.uspesnost_poslovanja);
                    }
                    $("#i_ime_uredi").val(uporabnik.ime);
                    M.updateTextFields();
                }
            }
        });
}
