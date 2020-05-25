genOmejitve();

function genOmejitve() {
    let search_data = JSON.parse(localStorage.getItem("search_data"));
    let omejitve = $("#omejitve");

    switch (search_data.tip_tovora) {
        case "posamezni izdelki":
            omejitve.append(getPill("Posamezni izdelki"));
            omejitve.append(getPill("Število izdelkov: " + search_data.izdelki.length));

            let teza = 0;
            for (const izdelek of search_data.izdelki) {
                teza += izdelek.teza * izdelek.kolicina;
            }
            omejitve.append(getPill("Skupna teža: " + teza + " kg"));
            break;
        case "razsut tovor":
            omejitve.append(getPill("Razsuti tovor"));

            omejitve.append(getPill("Volumen tovora: " + search_data.volumen_tovora + " m<sup>3</sup>"));
            omejitve.append(getPill("Teža tovora: " + search_data.teza_tovora + " kg"));
            break;
        case "palete":
            omejitve.append(getPill("Standardne palete"));
            omejitve.append(getPill("Število palet: " + search_data.st_palet));
            omejitve.append(getPill("Teža ene palete: " + search_data.teza_palete + " kg"));
            break;
    }
}

function getPill(text) {
    return '<div class="chip" style="font-family: Roboto;">' + text + '</div>'
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
                vozila.append(getCard(vozilo.naziv_podjetja, vozilo.cena_na_km, vozilo.znamka + " " + vozilo.model, vozilo.tip_vozila, vozilo.id));
            }
        }
    });


function getCard(podjetje, cena, vozilo, tip, id) {
    return `<a href="#!" onclick="details(` + id + `)" class="grey-text text-darken-4">
                <div class="col s12 grey lighten-3" style="padding: 15px; border-radius: 10px; margin-top: 10px;">
                    <div class="row" style="margin-bottom: 0;">
                        <div class="col m4 s12">
                            <img src="https://picsum.photos/500/350?random=1" alt="" class="responsive-img">
                        </div>
                        <div class="col m8 s12">
                            <div class="row">
                                <div class="col s12">
                                    <h5>` + podjetje + `</h5>
                                </div>
                            </div>
                            <div class="row" style="font-family: Roboto;">
                                <div class="col m3 s3">
                                    <span>Cena: ` + cena + `€/km</span>
                                </div>
                                <div class="col m5 s5">
                                    <span>Vozilo: ` + vozilo + `</span>
                                </div>
                                <div class="col m4 s4">
                                    <span>Tip vozila: ` + tip + `</span>
                                </div>
                            </div>
                            <div class="row" style="font-family: Roboto;">
                                <div class="col s12">
                                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
                                        doloremque recusandae impedit qui quia adipisci? Mollitia, vitae quam ad
                                        laborum et vel sequi labore cupiditate provident, esse magni omnis
                                        aspernatur?</span>
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
