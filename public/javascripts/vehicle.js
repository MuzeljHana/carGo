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
                        if ($("#search").val() != "" && !vozilo_attributes.includes($("#search").val().toLowerCase())) {
                            continue;
                        }
                        root.append(getCard(vozilo));
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

$("#search").change(function () {
    if ($("#search").val() == "") {
        updateData();
    }
});

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
            <div class="col m4 s12">
                <span>Registerska: ` + vozilo.registerska + `</span>
            </div>
            <div class="col m4 s12">
                <span id="aktivnost">Aktivnost: ` + aktivnost + `</span>
            </div>
            <div class="col m4 s12">
                <span>Zaseden: ` + zasedenost + `</span>
            </div>
            <div class="col m4 s12">
                <span>Teza: ` + vozilo.maks_teza_tovora + ` kg</span>
            </div>
            <div class="col m4 s12">
                <span>Palete: ` + vozilo.maks_st_palet + `</span>
            </div>
            <div class="col m4 s12">
                <span>Volumen: ` + vozilo.maks_volumen_tovora + ` m<sup>3</sup><span>
            </div>
            <div class="col m4 s12">
                <span>Dolžina: ` + vozilo.maks_dolzina_tovora + ` cm</span>
            </div>
            <div class="col m4 s12">
                <span>Širina: ` + vozilo.maks_sirina_tovora + ` cm</span>
            </div>
            <div class="col m4 s12">
                <span>Višina: ` + vozilo.maks_visina_tovora + ` cm<span></span></span>
            </div>
            <div class="col m4 s12">
                <span >Cena: <span id="trenutnaCena">` + cena + `</span> €/km</span>
            </div>
            <div class="col m4 s12">
                <span>Tip vozila: ` + vozilo.tip_vozila + ` </span>
            </div>
            <div class="col m4 s12">
                <span>Potrdilo izpravnosti: ` + vozilo.potrdilo_izpravnosti + ` </span>
            </div>
        </div>
        <div class="row">
            <div class="col m3 s6 left">
                <label>
                    <input type="checkbox" class="filled-in left" onchange="editActive(this, ` + vozilo.id + `)" ` + ((vozilo.aktivno) ? 'checked="checked"' : "") + `" />
                    <span>Aktiven</span>
                </label>
            </div>
            <div class="col m3 s6 right">
                <a class="waves-effect waves-light btn-flat right modal-trigger"
                    style="text-transform: none;" href="#modal2" onclick="prenosPodatkov(` + vozilo.id + `)">Uredi</a>
            </div>
        </div>
    </div>
</div>
</div>`;
}

function prenosPodatkov(id) {
    $("#edit").val(id);
    $.ajax({
        method: "get",
        url: `/vehicle/${id}`,
        dataType: "json"
    })
        .done(function (data) {
            if (data) {
                let vozilo = data[0];
                $("#registerska-uredi").val(vozilo.registerska);
                $("#znamka-uredi").val(vozilo.znamka);
                $("#letnik-uredi").val(vozilo.letnik);
                $("#tip-uredi").val(vozilo.tip_vozila);
                $("#max_teza-uredi").val(vozilo.maks_teza_tovora);
                $("#potrdilo_izpravnosti-uredi").val(vozilo.potrdilo_izpravnosti);
                $("#maks_volumen_tovora-uredi").val(vozilo.maks_volumen_tovora);
                $("#maks_st_palet-uredi").val(vozilo.maks_st_palet);
                $("#maks_dolzina_tovora-uredi").val(vozilo.maks_dolzina_tovora);
                $("#maks_visina_tovora-uredi").val(vozilo.maks_visina_tovora);
                $("#maks_sirina_tovora-uredi").val(vozilo.maks_sirina_tovora);
                $("#cena-uredi").val(vozilo.cena_na_km);
                $("#model-uredi").val(vozilo.model);
                M.updateTextFields();
                $('select').formSelect();
            }
        });
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

    fetch('/vehicle', {
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
    fetch(`/vehicle/${id}`, {
        method: 'DELETE'
    }).then((response) => {
        updateData();
        console.log("Vehicle successfully deleted");
    });
};

function editActive(el, id) {
    let bool = 0;
    if ($(el).is(":checked")) {
        bool = 1;
    }
    fetch(`/vehicle/${id}/active/${bool}`, {
        method: 'PUT'
    }).then((response) => {
        updateData();
        console.log("Vehicle activity successfully edited");
    });
};

$("#edit").click(function () {
    let id = $("#edit").val();
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

    fetch('/vehicle/editVehicle', {
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
