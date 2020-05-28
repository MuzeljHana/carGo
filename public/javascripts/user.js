$("#edit").click (function() {
    let ime = document.getElementById('ime-uredi').value;
    let priimek = document.getElementById('priimek-uredi').value;
    let email = document.getElementById('email-uredi').value;
    let geslo = document.getElementById('geslo-uredi').value;
    let naziv_podjetja = document.getElementById('naziv_podjetja-uredi').value;
    let davcna = document.getElementById('davcna-uredi').value;
    let zacetek_delovanja = document.getElementById('zacetek_delovanja-uredi').value;
    let uspesnost_poslovanja = document.getElementById('uspesnot_poslovanja-uredi').value;
    
    let podatkiUporabnika = {
        'ime': ime,
        'priimek': priimek,
        'email': email,
        'geslo': geslo,
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
}

$.ajax({
        method: "get",
        url: "/user/",
        dataType: "json"
    })
    .done(function (data) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                
                    let uporabnik = data[i];
                    if ($("#i_ime_uredi").val(uporabnik.ime)) {
                        $("#i_ime_uredi").focus();
                    }
                    if ($("#i_priimek_uredi").val(uporabnik.priimek)) {
                        $("#i_priimek_uredi").focus();
                    }
                    /*if ($("#i_postna_stevilka_uredi").val(uporabnik.po)) {
                        $("#i_postna_stevilka_uredi").focus();
                    }
                    if ($("#i_kraj_uredi").val(uporabnik.geslo)) {
                        $("#i_kraj_uredi").focus();
                    }*/
                    if ($("#i_ulica_uredi").val(uporabnik.ulica)) {
                        $("#i_ulica_uredi").focus();
                    }
                    if ($("#i_hisna_stevilka_uredi").val(uporabnik.naziv_podjetja)) {
                        $("#i_hisna_stevilka_uredi").focus();
                    }
                    if ($("#i_hisna_stevilka_uredi").val(uporabnik.naziv_podjetja)) {
                        $("#i_hisna_stevilka_uredi").focus();
                    }
                    if ($("#i_email_uredi").val(uporabnik.email)) {
                        $("#i_email_uredi").focus();
                    }
                    
                    break;
            }        
        }
    });

