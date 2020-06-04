genOmejitve();

function genOmejitve() {
    let search_data = JSON.parse(localStorage.getItem("search_data"));
    let omejitve = $("#omejitve");

    switch (search_data.tip_tovora) {
        case "posamezni izdelki":
            omejitve.append(getPill("Posamezni izdelki"));
            omejitve.append(getPill(`Število izdelkov: ${search_data.izdelki.length}`));

            let teza = 0;
            for (const izdelek of search_data.izdelki) {
                teza += izdelek.teza * izdelek.kolicina;
            }
            omejitve.append(getPill(`Skupna teža: ${teza} kg`));
            break;
        case "razsut tovor":
            omejitve.append(getPill(`Razsuti tovor`));

            omejitve.append(getPill(`Volumen tovora: ${search_data.volumen_tovora} m<sup>3</sup>`));
            omejitve.append(getPill(`Teža tovora: ${search_data.teza_tovora} kg`));
            break;
        case "palete":
            omejitve.append(getPill(`Standardne palete`));
            omejitve.append(getPill(`Število palet: ${search_data.st_palet}`));
            omejitve.append(getPill(`Teža ene palete: ${search_data.teza_palete} kg`));
            break;
    }

    if (search_data.dodatno) {
        if (search_data.dodatno.cena) {
            omejitve.append(getPill(`Maksimalna cena: ${search_data.dodatno.cena}€`));
        }
        if (search_data.dodatno.prevoznik) {
            omejitve.append(getPill(`Prevoznik: ${search_data.dodatno.prevoznik}`));
        }
        if (search_data.dodatno.letnik) {
            omejitve.append(getPill(`Minimalen letnik vozila: ${search_data.dodatno.letnik}`));
        }
        if (search_data.dodatno.tip) {
            omejitve.append(getPill(`Tip vozila: ${search_data.dodatno.tip}`));
        }
    }
}

function getPill(text) {
    return `<div class="chip normal-text">${text}</div>`;
}

$.ajax({
    method: "post",
    url: "/vehicle/search",
    data: JSON.parse(localStorage.getItem("search_data")),
    dataType: "json"
})
    .done(function (data) {
        if (data) {
            let vozila = $("#vozila");
            for (const vozilo of data) {
                vozila.append(getCard(vozilo));
            }
        }
    });


function getCard(vozilo) {
    let tip;
    switch (vozilo.tip_vozila) {
        case "kombi":
            tip = "Dostavni kombi";
            break;
        case "tovornjak razsut tovor":
            tip = "Tovornjak za prevoz razsutega tovora";
            break;
        case "tovornjak blago":
            tip = "Tovornjak za prevoz blaga";
            break;
        case "izredni prevoz":
            tip = "Izredni prevoz";
            break;
    }
    return `<a href="#!" onclick="details(${vozilo.id})" class="grey-text text-darken-4">
                <div class="col s12 grey lighten-3 rounded" style="padding: 15px; margin-top: 10px;">
                    <div class="row" style="margin-bottom: 0;">
                        <div class="col m4 s12">
                            <div class="rounded card-image" style="background-image: url(/vehicle/${vozilo.id}/image);"></div>
                        </div>
                        <div class="col m8 s12">
                            <div class="row">
                                <div class="col s12">
                                    <h5>${vozilo.naziv_podjetja}</h5>
                                </div>
                            </div>
                            <div class="row normal-text" style="font-size: 18px;">
                                <div class="col m3 s3">
                                    <span>Cena: ${vozilo.cena_na_km}€/km</span>
                                </div>
                                <div class="col m5 s5">
                                    <span>Vozilo: ${vozilo.znamka} ${vozilo.model}</span>
                                </div>
                                <div class="col m4 s4">
                                    <span>Tip vozila: ${tip}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>`
}

function details(id) {
    localStorage.setItem("details_vehicle", id);
    window.location = "/transports/details";
}
