$.ajax({
    method: "post",
    url: "/vehicle/search",
    data: JSON.parse(localStorage.getItem("search_data")),
    dataType: "json"
})
    .done(function (data) {
        if (data) {
            let vehicle_id = localStorage.getItem("details_vehicle");
            let vehicle = data.find((veh) => { return veh.id == Number(vehicle_id); });

            $("#img").attr("src", `/vehicle/${vehicle.id}/image`);
            $("#podjetje").text(vehicle.naziv_podjetja);
            $("#vozilo").text(vehicle.znamka + " " + vehicle.model);
            $("#letnik").text(vehicle.letnik);
            $("#tip").text(vehicle.tip_vozila);
            $("#cena_na_km").text(vehicle.cena_na_km);

            let omejitve_vozila = $("#omejitve");
            omejitve_vozila.append("<li>Teža tovora: " + vehicle.maks_teza_tovora + " kg</li>");

            if (vehicle.maks_volumen_tovora) {
                omejitve_vozila.append("<li>Volumen tovora: " + vehicle.maks_volumen_tovora + " m<sup>3</sup></li>");
            }
            if (vehicle.maks_dolzina_tovora) {
                omejitve_vozila.append("<li>Dolžina tovora: " + vehicle.maks_dolzina_tovora + " cm</li>");
            }
            if (vehicle.maks_sirina_tovora) {
                omejitve_vozila.append("<li>Širina tovora: " + vehicle.maks_sirina_tovora + " cm</li>");
            }
            if (vehicle.maks_visina_tovora) {
                omejitve_vozila.append("<li>Višina tovora: " + vehicle.maks_visina_tovora + " cm</li>");
            }
            if (vehicle.maks_st_palet) {
                omejitve_vozila.append("<li>Število palet: " + vehicle.maks_st_palet + "</li>");
            }
        }
    });

genOmejitve();
genMap();

function genMap() {
    let search_data = JSON.parse(localStorage.getItem("search_data"));
    setStart(search_data.nalozitev.kraj);
    setEnd(search_data.dostava.kraj);
}

function genOmejitve() {
    let search_data = JSON.parse(localStorage.getItem("search_data"));
    let omejitve = $("#omejitve_tovor");

    switch (search_data.tip_tovora) {
        case "posamezni izdelki":
            omejitve.append(getPill("Število izdelkov: " + search_data.izdelki.length));

            let teza = 0;
            for (const izdelek of search_data.izdelki) {
                teza += izdelek.teza * izdelek.kolicina;
            }
            omejitve.append(getPill("Skupna teža: " + teza + " kg"));
            break;
        case "razsut tovor":
            omejitve.append(getPill("Volumen tovora: " + search_data.volumen_tovora + " m<sup>3</sup>"));
            omejitve.append(getPill("Teža tovora: " + search_data.teza_tovora + " kg"));
            break;
        case "palete":
            omejitve.append(getPill("Število palet: " + search_data.st_palet));
            omejitve.append(getPill("Teža ene palete: " + search_data.teza_palete + " kg"));
            break;
    }
}

function getPill(text) {
    return '<div class="chip normal-text">' + text + '</div>'
}

$("#ponudba").click(function () {
    let search_data = JSON.parse(localStorage.getItem("search_data"));
    let vehicle_id = Number(localStorage.getItem("details_vehicle"));
    let datum = search_data.datum.split(".");
    let cas_nalozitve = datum[2] + "-" + datum[1] + "-" + datum[0] + " " + search_data.cas;

    let data = {
        "nalozitev_kraj": search_data.nalozitev.kraj,
        "nalozitev_postna_stevilka": search_data.nalozitev.posta,
        "nalozitev_ulica": search_data.nalozitev.ulica,
        "nalozitev_hisna_stevilka": search_data.nalozitev.stevilka,
        "dostava_kraj": search_data.dostava.kraj,
        "dostava_postna_stevilka": search_data.dostava.posta,
        "dostava_ulica": search_data.dostava.ulica,
        "dostava_hisna_stevilka": search_data.dostava.stevilka,
        "idVozilo": vehicle_id,
        "cas_nalozitve": cas_nalozitve,
        "tip_tovora": search_data.tip_tovora,
        "pripombe": $("#opombe").val()
    };

    switch (search_data.tip_tovora) {
        case "posamezni izdelki":
            data.izdelki = search_data.izdelki;
            break;
        case "razsut tovor":
            data.teza_tovora = search_data.teza_tovora;
            data.volumen_tovora = search_data.volumen_tovora;
            break;
        case "palete":
            data.st_palet = search_data.st_palet;
            data.teza_palete = search_data.teza_palete;
            break;
    }

    console.log(data);

    $.ajax({
        method: "post",
        url: "/order/",
        data: data,
        dataType: "json"
    })
        .done(function (data) {
            if (data) {
                if (data.message == "success") {
                    window.location = "/profile/orders";
                }
            }
        });
});
