function confirm() {
    //  pridobivanje podatkov s spletne strani
    let casNalozitve = document.getElementById("casNalozitve").innerHTML;
    let status = document.getElementById("status").innerHTML;
    let casPonudbe = document.getElementById("casPonudbe").innerHTML;
    let pripombe = document.getElementById("pripombe").value;
    let teza = document.getElementById("tezaTovora").value;
    let volumen = document.getElementById("volumen").value;
    let steviloPalet = document.getElementById("stPalet").value;
    let tezaPalet = document.getElementById("tezaPalet").value;

    //  tuji ključ
    let idUporabnik = sessionStorage.getItem("idUporabnik");
    let vozilo = document.getElementById("vehicleID").innerHTML;

    //  informacije za pridobivanje tujih ključev
    let tipTovora = document.getElementById("tipTovora").value;
    let nalozitev = document.getElementById("nalozitev").innerHTML;
    let dostava = document.getElementById("dostava").innerHTML;  
    
    let podatki = {
        'casNalozitve': casNalozitve,
        'status': status,
        'casPonudbe': casPonudbe,
        'pripombe': pripombe,
        'teza': teza,
        'volumen': volumen,
        'steviloPalet': steviloPalet,
        'tezaPalet': tezaPalet,
        'idUporabnik': idUporabnik,
        'vozilo': vozilo,
        'tipTovora': tipTovora,
        'nalozitev': nalozitev,
        'dostava': dostava
    }

    fetch('http://localhost:3000/confirmation', {
        method: 'POST',
        body: JSON.stringify(podatki),
        headers: {
            'content-type': 'application/json'
        }
    }).then((response) => {
        console.log("Order successfully confirmed");
    });
}