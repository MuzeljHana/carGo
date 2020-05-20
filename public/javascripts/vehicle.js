$("[name='tip']").change(function () {
    let tip = $("select[name='tip']").val();
    
    $("#tab-tovor").hide();
    $("#tab-izdelki").hide();
    $("#tab-palete").hide();
    switch (tip) {
        case "kombi":
            $("#tab-izdelki").show();
            break;
        case "izredni prevoz":
            $("#tab-izdelki").show();
            break;
        case "tovornjak razsut tovor":
            $("#tab-tovor").show();
            break;
        case "tovornjak blago":
            $("#tab-palete").show();
            $("#tab-izdelki").show();
            break;
    }
});

$.ajax({
    method: "get",
    url: "/vehicle",
    dataType: "json"
})
    .done(function (data) {
        if (data) {
            let root = $("#vozila");
            for (let i = 0; i < data.length; i++) {
                root.append(getCard(data[i]));
            }
        }
    });

function getCard(vozilo) {
    let zasedenost, aktivnost = '';
    if (vozilo.aktivno==1){aktivnost='da'}else aktivnost='ne';
    if (vozilo.zasedeno==1){zasedenost='da'}else zasedenost='ne';

    return `<div class="row" style="padding: 0 15px 0 15px;">
<div class="col s12 white" style="border-radius: 10px; padding: 15px;">
    <div class="col s12 m4 valign-wrapper center-align">
        <img src="https://picsum.photos/500/350?random=1" alt="" class="responsive-img">
    </div>
    <div class="col s12 m8">
        <div class="row">
            <div class="col s10">
                <h4>` + vozilo.model+' '+vozilo.letnik + `</h4>
            </div>
            <div class="col s2" style="margin-top: 25px;">
                <a class="waves-effect waves-light btn-flat right"><i
                        class="material-icons">close</i></a>
            </div>
        </div>
        <div class="row">
            <div class="col s4">
                <span>Registerska: ` + vozilo.registerska + `€/km</span>
            </div>
            <div class="col s4">
                <span>Aktivnost: ` + aktivnost + `</span>
            </div>
            <div class="col s4">
                <span>Zaseden: ` + zasedenost + `</span>
            </div>
        </div>
        <div class="row">
            <div class="col s4">
                <span>Teza: ` + vozilo.maks_teza_tovora + `</span>
            </div>
            <div class="col s4">
                <span>Palete: ` + vozilo.maks_st_palet + `</span>
            </div>
            <div class="col s4">
                <span>Volumen: ` + vozilo.maks_volumen_tovora + `<span>
            </div>
        </div>
        <div class="row">
            <div class="col s4">
                <span>Dolžina: ` + vozilo.maks_dolzina_tovora + `</span>
            </div>
            <div class="col s4">
                <span>Širina: ` + vozilo.maks_sirina_tovora + `</span>
            </div>
            <div class="col s4">
                <span>Višina: ` + vozilo.maks_visina_tovora + `<span></span></span>
            </div>
        </div>
        <div class="row">
            <a class="waves-effect waves-light btn-flat right"
                style="text-transform: none;">Uredi</a>
        </div>
    </div>
</div>
</div>`;
}

$("#agree").click(function () {
    let letnik = document.getElementById('letnik').value;
    let registerska = document.getElementById('registerska').value;
    let model = document.getElementById('model').value;
    let maks_teza_tovora = document.getElementById('max_teza').value;
    let potrdilo_izpravnosti = document.getElementById('potrdilo_izpravnosti').value;
    let maks_volumen_tovora = document.getElementById('maks_volumen_tovora').value;
    let maks_dolzina_tovora = document.getElementById('maks_dolzina_tovora').value;
    let maks_sirina_tovora = document.getElementById('maks_sirina_tovora').value;
    let maks_visina_tovora = document.getElementById('maks_visina_tovora').value;
    let maks_st_palet = document.getElementById('maks_st_palet').value;
    let tip_vozila = document.getElementById('tip').value;
    let znamka  = document.getElementById('znamka').value;
    
    let podatki = {
        'letnik': letnik,
        'registerska': registerska,
        'model': model,
        'maks_teza_tovora': maks_teza_tovora,
        'potrdilo_izpravnosti': potrdilo_izpravnosti,
        'maks_volumen_tovora': maks_volumen_tovora,
        'maks_dolzina_tovora': maks_dolzina_tovora,
        'maks_sirina_tovora': maks_sirina_tovora,
        'maks_visina_tovora': maks_visina_tovora,
        'maks_st_palet': maks_st_palet,
        'tip_vozila': tip_vozila,
        'znamka': znamka,
    }
 
    fetch('http://localhost:3000/vehicle', {
        method: 'POST',
        body: JSON.stringify(podatki),
        headers: {
            'Content type': 'application/json'
        }
    }).then((response) => {
        console.log("Vehicle successfully added");
    });
});