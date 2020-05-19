function confirm() {
    //  pridobivanje podatkov s spletne strani
    let casNalozitve = document.getElementById("casNalozitve").innerHTML;
    let status = document.getElementById("status").innerHTML;
    let casPonudbe = document.getElementById("casPonudbe").innerHTML;
    let pripombe = document.getElementById("pripombe").value;
    let tezaTovora = document.getElementById("tezaTovora").value;
    let volumenTovora = document.getElementById("volumen").value;
    let stPalet = document.getElementById("stPalet").value;
    let tezaPalet = document.getElementById("tezaPalet").value;

    //  tuji ključ
    let idUporabnik = sessionStorage.getItem("idUporabnik");
    let idVozilo = document.getElementById("vehicleID").innerHTML;

    //  informacije za pridobivanje tujih ključev
    let tipTovora = document.getElementById("tipTovora").value;
    let nalozitev = document.getElementById("nalozitev").innerHTML;
    let dostava = document.getElementById("dostava").innerHTML;  

    fetch('http://localhost:3000/confirmation/', {
        method: 'POST',
        body: JSON.stringify([casNalozitve, status, casPonudbe, pripombe, tezaTovora, volumenTovora, 
            stPalet, tezaPalet, tipTovora, nalozitev, dostava, idUporabnik,
            idVozilo, tipTovora, nalozitev, dostava]),
        headers: {
            'Content type': 'application/json'
        }
    }).then((response) => {
        console.log("Order successfully confirmed");
    });
}