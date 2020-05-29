$("input[name='tip_tovora']").change(function () {
    let tip = $("input[name='tip_tovora']:checked").val();

    $("#tab-izdelki").hide();
    $("#tab-tovor").hide();
    $("#tab-palete").hide();
    switch (tip) {
        case "posamezni izdelki":
            $("#tab-izdelki").show();
            break;
        case "razsut tovor":
            $("#tab-tovor").show();
            break;
        case "palete":
            $("#tab-palete").show();
            break;
    }
});

$("#isci").click(function () {
    let search_data = new Object();
    let tip = $("input[name='tip_tovora']:checked").val()
    search_data.tip_tovora = tip;
    switch (tip) {
        case "posamezni izdelki":
            let arr = [];
            for (const card of $("#izdelki").children()) {
                arr.push(getCardData(card));
            }
            search_data.izdelki = arr;
            break;
        case "razsut tovor":
            let volumen = $("#volumen").val();
            let teza = $("#teza").val();
            search_data.volumen_tovora = volumen;
            search_data.teza_tovora = teza;
            break;
        case "palete":
            let st_palet = $("#st_palet").val();
            let teza_palete = $("#teza_palet").val();
            search_data.st_palet = st_palet;
            search_data.teza_palete = teza_palete;
            break;
    }

    search_data.datum = $("#date").val();
    search_data.cas = $("#time").val();

    search_data.nalozitev = {
        ulica: $("#n_ulica").val(),
        stevilka: $("#n_hisna_stevilka").val(),
        kraj: $("#n_kraj").val(),
        posta: $("#n_postna_stevilka").val()
    };

    search_data.dostava = {
        ulica: $("#d_ulica").val(),
        stevilka: $("#d_hisna_stevilka").val(),
        kraj: $("#d_kraj").val(),
        posta: $("#d_postna_stevilka").val()
    };

    search_data.dodatno = {};
    if ($("#cena").val()) {
        search_data.dodatno.cena = $("#cena").val();
    }
    if ($("#prevoznik").val()) {
        search_data.dodatno.prevoznik = $("#prevoznik").val();
    }
    if ($("#letnik").val()) {
        search_data.dodatno.letnik = $("#letnik").val();
    }
    if ($("#tip option:selected").val()) {
        search_data.dodatno.tip = $("#tip option:selected").val();
    }

    localStorage.setItem("search_data", JSON.stringify(search_data));

    window.location = "/transports";
});

$("input[name='tip_tovora']:checked, #date, #time, #n_ulica, #n_hisna_stevilka, #n_kraj, #n_postna_stevilka, #d_ulica, #d_hisna_stevilka, #d_kraj, #d_postna_stevilka").change(function () {
    let fail = false;
    let tip = $("input[name='tip_tovora']:checked").val()
    switch (tip) {
        case "posamezni izdelki":
            if ($("#izdelki").children().length == 0) {
                fail = true;
            }
            break;
        case "razsut tovor":
            let volumen = $("#volumen").val();
            let teza = $("#teza").val();
            if (!(volumen && teza)) {
                fail = true;
            }
            break;
        case "palete":
            let st_palet = $("#st_palet").val();
            let teza_palete = $("#teza_palet").val();
            if (!(st_palet && teza_palete)) {
                fail = true;
            }
            break;
    }

    let datum = $("#date").val();
    let cas = $("#time").val();
    let n_ulica = $("#n_ulica").val();
    let n_stevilka = $("#n_hisna_stevilka").val();
    let n_kraj = $("#n_kraj").val();
    let n_posta = $("#n_postna_stevilka").val();
    let d_ulica = $("#d_ulica").val();
    let d_stevilka = $("#d_hisna_stevilka").val();
    let d_kraj = $("#d_kraj").val();
    let d_posta = $("#d_postna_stevilka").val();

    if (!(datum && cas && n_ulica && n_stevilka && n_kraj && n_posta && d_ulica && d_stevilka && d_kraj && d_posta)) {
        fail = true;
    }

    if (fail) {
        $("#isci").addClass("disabled");
    } else {
        $("#isci").removeClass("disabled");
    }
});

function getCardData(el) {
    let obj = new Object();
    let id = el.id.replace("card_", "");
    obj.visina = parseInt($("#visina" + id).val());
    obj.dolzina = parseInt($("#dolzina" + id).val());
    obj.sirina = parseInt($("#sirina" + id).val());
    obj.teza = parseInt($("#teza" + id).val());
    obj.kolicina = parseInt($("#kolicina" + id).val());
    return obj;
}

$("#dodaj").click(function () {
    $("#izdelki").append(getCard());
    M.updateTextFields();
});

function odstrani(id) {
    $("#card_" + id).remove();
}

var cardCount = 0
function getCard() {
    let id = cardCount++;
    return `<div id="card_` + id + `" class="row white rounded" style="padding: 10px;">
                <div class="row">
                    <div class="col s4">
                        <h5 style="font-weight: bold;">Izdelek</h5>
                    </div>
                    <div class="col s1 right" style="margin-top: 10px;">
                        <a onclick="odstrani(` + id + `)" class="a btn-flat right grey-text text-darken-4"><i class="material-icons">close</i></a>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col m2 offset-m1 s4">
                        <input id="visina` + id + `" type="number" min="1" value="1">
                        <label for="visina` + id + `">Višina v cm</label>
                    </div>
                    <div class="input-field col m2 s4">
                        <input id="dolzina` + id + `" type="number" min="1" value="1">
                        <label for="dolzina` + id + `">Dolžina v cm</label>
                    </div>
                    <div class="input-field col m2 s4">
                        <input id="sirina` + id + `" type="number" min="1" value="1">
                        <label for="sirina` + id + `">Širina v cm</label>
                    </div>
                    <div class="input-field col m2 offset-s2 s4">
                        <input id="teza` + id + `" type="number" min="1" value="1">
                        <label for="teza` + id + `">Teža v kg</label>
                    </div>
                    <div class="input-field col m2 s4">
                        <input id="kolicina` + id + `" type="number" min="1" value="1">
                        <label for="kolicina` + id + `">Količina</label>
                    </div>
                </div>
            </div>`
}

$("#n_kraj").change(function () {
    setStart($("#n_kraj").val());
});

$("#d_kraj").change(function () {
    setEnd($("#d_kraj").val());
});
