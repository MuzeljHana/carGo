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
}