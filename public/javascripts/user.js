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