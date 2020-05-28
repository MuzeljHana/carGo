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















/*
function prenosPodatkovUporabnika(id) {
    $.ajax({
        method: "get",
        url: "/user/",
        dataType: "json"
    })
    .done(function (data) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    let uporabnik = data[i];
                    if ($("#ime-uredi").val(uporabnik.ime)) {
                        $("#ime-uredi").focus();
                    }
                    if ($("#priimek-uredi").val(uporabnik.priimek)) {
                        $("#priimek-uredi").focus();
                    }
                    if ($("#email-uredi").val(uporabnik.email)) {
                        $("#email-uredi").focus();
                    }
                    if ($("geslo-uredi").val(uporabnik.geslo)) {
                        $("#geslo-uredi").focus();
                    }
                    if ($("#naziv_podjetja-uredi").val(uporabnik.naziv_podjetja)) {
                        $("#naziv_podjetja-uredi").focus();
                    }
                    if ($("#davcna-uredi").val(uporabnik.davcna) {
                        $("#davcna-uredi").focus();
                    }
                    if ($("#zacetek_delovanja-uredi").val(uporabnik.zacetek_delovanja)) {
                        $("#zacetek_delovanja-uredi").focus();
                    }
                    if ($("#uspesnot_poslovanja-uredi").val(uporabnik.uspesnost_poslovanja)) {
                        $("#uspesnot_poslovanja-uredi").focus();
                    }
                    /*
                    if ($("#model-uredi").val(vozilo.model)) {
                        $("#model-uredi").focus();
                    }
                    
                    break;
                }
            }        
        }
    });
    userID(id);
}

function userID(id) {
    sessionStorage.setItem("userID", id);
}
*/