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
            search_data.volumed_tovora = volumen;
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

    search_data.dodatno = {
        cena: $("#cena").val(),
        prevoznik: $("#prevoznik").val(),
        letnik: $("#letnik").val(),
        tip: $("#tip option:selected").val()
    };

    localStorage.setItem("search_data", JSON.stringify(search_data));

    window.location = "/transports";
});

function getCardData(el) {
    let obj = new Object();
    let id = el.id.replace("card_", "");
    obj.visina = parseInt($("#visina" + id).val()) || 1;
    obj.dolzina = parseInt($("#dolzina" + id).val()) || 1;
    obj.sirina = parseInt($("#sirina" + id).val()) || 1;
    obj.teza = parseInt($("#teza" + id).val()) || 1;
    obj.kolicina = parseInt($("#kolicina" + id).val()) || 1;
    return obj;
}


$("#dodaj").click(function () {
    $("#izdelki").append(getCard());
});

function odstrani(id) {
    $("#card_" + id).remove();
}

var cardCount = 0
function getCard() {
    let id = cardCount++;
    return `<div id="card_` + id + `" class="row white" style="border-radius: 10px; padding: 10px;">
                <div class="row">
                    <div class="col s4">
                        <h5 style="font-weight: bold;">Izdelek</h5>
                    </div>
                    <div class="col s1 right" style="margin-top: 10px;">
                        <a onclick="odstrani(` + id + `)" class="a btn-flat right grey-text text-darken-4"><i class="material-icons">close</i></a>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s2 offset-s1">
                        <input id="visina` + id + `" type="number" min="1">
                        <label for="visina` + id + `">Višina v cm</label>
                    </div>
                    <div class="input-field col s2">
                        <input id="dolzina` + id + `" type="number" min="1">
                        <label for="dolzina` + id + `">Dolžina v cm</label>
                    </div>
                    <div class="input-field col s2">
                        <input id="sirina` + id + `" type="number" min="1">
                        <label for="sirina` + id + `">Širina v cm</label>
                    </div>
                    <div class="input-field col s2">
                        <input id="teza` + id + `" type="number" min="1">
                        <label for="teza` + id + `">Teža v kg</label>
                    </div>
                    <div class="input-field col s2">
                        <input id="kolicina` + id + `" type="number" min="1">
                        <label for="kolicina` + id + `">Količina</label>
                    </div>
                </div>
            </div>`
}

let key = "pk.eyJ1IjoidGphbiIsImEiOiJja2FxajhibTYyOGpnMnNwNjFwem4xMXNjIn0.EZT8ffs1GmMUZIaSqQW3HA";

L.mapbox.accessToken = key;
let map = L.mapbox.map('map', 'mapbox.streets', { attributionControl: { compact: true } })
    .setView([46.1488296, 14.4326165], 9)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

let geocoder = new L.Control.Geocoder.mapbox(key);

let control = L.Routing.control({
    router: L.Routing.mapbox(key),
    plan: L.Routing.plan([], {
        createMarker: (i, wp) => {
            return L.marker(wp.latLng, {
                icon: L.divIcon({
                    iconAnchor: [15, 30],
                    className: 'map-marker',
                    html: '<span class="material-icons red-text" style="font-size: 35px;">location_on</span>'
                })
            });
        }
    }),
    routeWhileDragging: false,
    lineOptions: {
        styles: [{
            color: '#2196f3',
            opacity: 1,
            weight: 6
        }]
    },
    fitSelectedRoutes: true,
    show: false
}).addTo(map);

$("#n_kraj").change(function () {
    geocoder.geocode($("#n_kraj").val(), (data) => {
        let res = data[0].center;
        control.spliceWaypoints(0, 1, L.latLng(res.lat, res.lng));
    })
});

$("#d_kraj").change(function () {
    geocoder.geocode($("#d_kraj").val(), (data) => {
        let res = data[0].center;
        control.spliceWaypoints(1, 1, L.latLng(res.lat, res.lng));
    })
});
