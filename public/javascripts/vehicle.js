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

$("#tip-uredi").change(function () {
    let tip = $("#tip-uredi").val();

    $("#tab-tovor-urejanje").hide();
    $("#tab-izdelki-urejanje").hide();
    $("#tab-palete-urejanje").hide();
    switch (tip) {
        case "kombi":
            $("#tab-izdelki-urejanje").show();
            break;
        case "izredni prevoz":
            $("#tab-izdelki-urejanje").show();
            break;
        case "tovornjak razsut tovor":
            $("#tab-tovor-urejanje").show();
            break;
        case "tovornjak blago":
            $("#tab-palete-urejanje").show();
            $("#tab-izdelki-urejanje").show();
            break;
    }
});

updateData();
function updateData() {
    $.ajax({
        method: "get",
        url: "/vehicle/",
        dataType: "json"
    })
        .done(function (data) {
            if (data) {
                let root = $("#vozila");
                root.empty();
                if (data.length == 0) {
                    root.html(`<div class="row"><div class="col s12 center-align"><h3>Ni ponudb</h3></div></div`)
                } else {
                    let autocomplete = {};
                    for (const vozilo of data) {
                        autocomplete[vozilo.znamka] = null;
                        autocomplete[vozilo.model] = null;
                        autocomplete[vozilo.registerska] = null;

                        let vozilo_attributes = [
                            vozilo.znamka.toLowerCase(),
                            vozilo.model.toLowerCase(),
                            vozilo.registerska.toLowerCase()
                        ];
                        if ($("#search").val() != "") {
                            if (vozilo_attributes.includes($("#search").val().toLowerCase())) {
                                root.append(getCard(vozilo));
                            }
                        } else {
                            root.append(getCard(vozilo));
                        }
                    }
                    $('input.autocomplete').autocomplete({
                        data: autocomplete,
                        onAutocomplete: () => {
                            updateData();
                        }
                    });
                }
            }
        });
}

function getCard(vozilo) {
    let zasedenost, aktivnost, cena = '';
    if (vozilo.aktivno == 1) { aktivnost = 'da' } else aktivnost = 'ne';
    if (vozilo.zasedeno == 1) { zasedenost = 'da' } else zasedenost = 'ne';
    if (vozilo.cena_na_km) { cena = vozilo.cena_na_km } else cena = '/';

    return `<div class="row" style="padding: 0 15px 0 15px;">
<div class="col s12 white rounded" style="padding: 15px;">
    <div class="col s12 m4 valign-wrapper center-align">
        <img src="https://picsum.photos/500/350?random=1" alt="" class="responsive-img">
    </div>
    <div class="col s12 m8">
        <div class="row">
            <div class="col s10">
                <h4>`+ vozilo.znamka + ' ' + vozilo.model + ' ' + vozilo.letnik + `</h4>
            </div>
            <div class="col s2" style="margin-top: 25px;">
                <a class="waves-effect waves-light btn-flat right" name="brisi" onclick="deleteVehicle(`+ vozilo.id + `)"><i
                        class="material-icons">close</i></a>
            </div>
        </div>
        <div class="row">
            <div class="col s4">
                <span>Registerska: ` + vozilo.registerska + `</span>
            </div>
            <div class="col s4">
                <span id="aktivnost">Aktivnost: ` + aktivnost + `</span>
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
            <div class="col s4">
            <span >Cena: <span id="trenutnaCena">` + cena + `</span> €/km</span>
            </div>
            <div class="col s8">
                <span>Tip vozila: ` + vozilo.tip_vozila + ` </span>
            </div>
        </div>
        <div class="row">
            <div class="col s6">
                <span>Potrdilo izpravnosti: ` + vozilo.potrdilo_izpravnosti + ` </span>
            </div>
            <div class="col s3">
                <a class="waves-effect waves-light btn-flat right"
                    style="text-transform: none;" id="idakt" onclick="editActive(`+ vozilo.id + `,` + vozilo.aktivno + `)">Aktiven</a>
            </div>
            <div class="col s3">
                <a class="waves-effect waves-light btn-flat right modal-trigger"
                    style="text-transform: none;" href="#modal2" id="id" value="`+ vozilo.id + `" onclick="prenosPodatkov(` + vozilo.id + `)">Uredi</a>
            </div>
        </div>
    </div>
</div>
</div>`;
}

function prenosPodatkov(id) {
    $.ajax({
        method: "get",
        url: "/vehicle/",
        dataType: "json"
    })
        .done(function (data) {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == id) {
                        let vozilo = data[i];
                        let cena = $("#trenutnaCena").html();
                        if ($("#registerska-uredi").val(vozilo.registerska)) {
                            $("#registerska-uredi").focus();
                        }
                        if ($("#znamka-uredi").val(vozilo.znamka)) {
                            $("#znamka-uredi").focus();
                        }
                        if ($("#letnik-uredi").val(vozilo.letnik)) {
                            $("#letnik-uredi").focus();
                        }
                        if ($("#max_teza-uredi").val(vozilo.maks_teza_tovora)) {
                            $("#max_teza-uredi").focus();
                        }
                        if ($("#potrdilo_izpravnosti-uredi").val(vozilo.potrdilo_izpravnosti)) {
                            $("#potrdilo_izpravnosti-uredi").focus();
                        }
                        if ($("#maks_volumen_tovora-uredi").val(vozilo.maks_volumen_tovora)) {
                            $("#maks_volumen_tovora-uredi").focus();
                        }
                        if ($("#maks_st_palet-uredi").val(vozilo.maks_st_palet)) {
                            $("#maks_st_palet-uredi").focus();
                        }
                        if ($("#maks_dolzina_tovora-uredi").val(vozilo.maks_dolzina_tovora)) {
                            $("#maks_dolzina_tovora-uredi").focus();
                        }
                        if ($("#maks_visina_tovora-uredi").val(vozilo.maks_visina_tovora)) {
                            $("#maks_visina_tovora-uredi").focus();
                        }
                        if ($("#maks_sirina_tovora-uredi").val(vozilo.maks_sirina_tovora)) {
                            $("#maks_sirina_tovora-uredi").focus();
                        }
                        if (cena) {
                            $("#cena-uredi").val(cena);
                            $("#cena-uredi").focus();
                        }
                        if ($("#model-uredi").val(vozilo.model)) {
                            $("#model-uredi").focus();
                        }
                        break;
                    }
                }
            }
        });
    vehicleID(id);
}

function vehicleID(id) {
    sessionStorage.setItem("vehicleID", id);
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
    let znamka = document.getElementById('znamka').value;
    let cena = document.getElementById('cena_na_km').value;

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
        'cena': cena
    }

    fetch('http://localhost:3000/vehicle', {
        method: 'POST',
        body: JSON.stringify(podatki),
        headers: {
            'content-type': 'application/json'
        }
    }).then((response) => {
        updateData();
        console.log("Vehicle successfully added");
    });
});

function deleteVehicle(id) {
    fetch(`http://localhost:3000/vehicle/${id}`, {
        method: 'DELETE'
    }).then((response) => {
        updateData();
        console.log("Vehicle successfully deleted");
    });
};

function editActive(id, bool) {
    if (bool == 0) {
        bool = 1;
    } else
        bool = 0;
    fetch(`http://localhost:3000/vehicle/${id}/active/${bool}`, {
        method: 'PUT'
    }).then((response) => {
        updateData();
        console.log("Vehicle activity successfully edited");
    });
};

$("#edit").click(function () {
    let id = sessionStorage.getItem("vehicleID");
    let letnik = document.getElementById('letnik-uredi').value;
    let registerska = document.getElementById('registerska-uredi').value;
    let model = document.getElementById('model-uredi').value;
    let maks_teza_tovora = document.getElementById('max_teza-uredi').value;
    let potrdilo_izpravnosti = document.getElementById('potrdilo_izpravnosti-uredi').value;
    let maks_volumen_tovora = document.getElementById('maks_volumen_tovora-uredi').value;
    let maks_dolzina_tovora = document.getElementById('maks_dolzina_tovora-uredi').value;
    let maks_sirina_tovora = document.getElementById('maks_sirina_tovora-uredi').value;
    let maks_visina_tovora = document.getElementById('maks_visina_tovora-uredi').value;
    let maks_st_palet = document.getElementById('maks_st_palet-uredi').value;
    let tip_vozila = document.getElementById('tip-uredi').value;
    let znamka = document.getElementById('znamka-uredi').value;
    let cena = document.getElementById('cena-uredi').value;

    let podatki = {
        'id': id,
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
        'cena': cena
    }

    fetch('http://localhost:3000/vehicle/editVehicle', {
        method: 'POST',
        body: JSON.stringify(podatki),
        headers: {
            'content-type': 'application/json'
        }
    }).then((response) => {
        updateData();
        console.log("Vehicle successfully edited");
    });
});
