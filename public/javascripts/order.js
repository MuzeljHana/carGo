getPonudbe();
function getPonudbe() {
    $.ajax({
        method: "get",
        url: "/order/",
        dataType: "json"
    })
        .done(function (data) {
            if (data) {
                let ponudbe = $("#ponudbe_ponudnik, #ponudbe_iskalec");
                ponudbe.empty();
                if (data.length == 0) {
                    ponudbe.html(`<div class="row"><div class="col s12 center-align"><h3>Ni ponudb</h3></div></div`)
                } else {
                    let autocomplete = {};
                    for (const ponudba of data) {
                        autocomplete[ponudba.vozilo.znamka] = null;
                        autocomplete[ponudba.vozilo.model] = null;
                        autocomplete[ponudba.vozilo.registerska] = null;
                        autocomplete[ponudba.ime] = null;
                        autocomplete[ponudba.priimek] = null;

                        let ponudba_attributes = [
                            ponudba.vozilo.znamka.toLowerCase(),
                            ponudba.vozilo.model.toLowerCase(),
                            ponudba.vozilo.registerska.toLowerCase(),
                            ponudba.ime.toLowerCase(),
                            ponudba.priimek.toLowerCase()
                        ];

                        if ($("#search").val() != "" && !ponudba_attributes.includes($("#search").val().toLowerCase())) {
                            continue;
                        }
                        if (ponudbe.attr('id') == "ponudbe_ponudnik") {
                            ponudbe.append(getCardPonudnik(ponudba));
                        } else {
                            ponudbe.append(getCardIskalec(ponudba));
                        }
                    }
                    $('input.autocomplete').autocomplete({
                        data: autocomplete,
                        onAutocomplete: () => {
                            getPonudbe();
                        }
                    });
                    $('select').formSelect();
                }
            }
        });
}

$("#search").change(function () {
    if ($("#search").val() == "") {
        getPonudbe();
    }
});

function potrdi(id) {
    $.ajax({
        method: "put",
        url: "/order/" + id + "/status/potrjeno",
        dataType: "json"
    })
        .done(function (data) {
            if (data.message == "success") {
                getPonudbe();
            }
        });
}

function zavrni(id) {
    $.ajax({
        method: "put",
        url: "/order/" + id + "/status/zavrnjeno",
        dataType: "json"
    })
        .done(function (data) {
            if (data.message == "success") {
                getPonudbe();
            }
        });
}

function zakljuci(id) {
    $.ajax({
        method: "put",
        url: "/order/" + id + "/status/koncano",
        dataType: "json"
    })
        .done(function (data) {
            if (data.message == "success") {
                getPonudbe();
            }
        });
}

function getCardPonudnik(ponudba) {
    let datum_full = new Date(ponudba.cas_nalozitve);
    let datum = `${String(datum_full.getHours()).padStart(2, '0')}:${String(datum_full.getMinutes()).padStart(2, '0')} ${String(datum_full.getDate()).padStart(2, '0')}.${String(datum_full.getMonth()+1).padStart(2, '0')}.${datum_full.getFullYear()}`;

    let pripombe = "";
    if (ponudba.pripombe) {
        pripombe = `<div class="row">
            <div class="col s12">
                <h5>Pripombe</h5>
                <p>` + ponudba.pripombe + `</p>
            </div>
        </div>`
    }

    let tovor = "";
    switch (ponudba.tip_tovora) {
        case "palete":
            tovor = `<div class="col s12">
                    <span>Tip: Standardne palete</span>
                </div>
                <div class="col s12">
                    <span>Število palet: ` + ponudba.st_palet + `</span>
                </div>
                <div class="col s12">
                    <span>Teža palete: ` + ponudba.teza_palet + ` kg</span>
                </div>
                <div class="col s12">
                    <span>Skupna teža: ` + (ponudba.teza_palet * ponudba.st_palet) + ` kg</span>
                </div>`;
            break;
        case "posamezni izdelki":
            let teza = 0;
            let volumen = 0;
            for (const izdelek of ponudba.izdelki) {
                teza += izdelek.teza * izdelek.kolicina;
                volumen += izdelek.dolzina * izdelek.visina * izdelek.sirina;
            }
            tovor = `<div class="col s12">
                    <span>Tip: Posamezni izdelki</span>
                </div>
                <div class="col s12">
                    <span>Skupen volumen izdelkov: ` + volumen + ` cm<sup>3</sup></span>
                </div>
                <div class="col s12">
                    <span>Skupna teža izdelkov: ` + teza + ` kg</span>
                </div>`;
            break;
        case "razsut tovor":
            tovor = `<div class="col s12">
                    <span>Tip: Razsut tovor</span>
                </div>
                <div class="col s12">
                    <span>Volumen: ` + izdelek.volumen_tovora + ` m<sup>3</sup></span>
                </div>
                <div class="col s12">
                    <span>Teža: ` + izdelek.teza_tovora + ` kg</span>
                </div>`;
            break;
    }

    controls = `<div class="col s12 center-align">
        <a onclick="potrdi(` + ponudba.id + `)" class="waves-effect waves-light btn">Potrdi</a>
        <a onclick="zavrni(` + ponudba.id + `)" class="waves-effect waves-dark btn red">Zavrni</a>
    </div>`;
    if (ponudba.status == "potrjeno") {
        controls = `<div class="col s12 center-align">
            <a onclick="zakljuci(` + ponudba.id + `)" class="waves-effect waves-light btn">Zaključi</a>
        </div>`
    }

    return `<div class="row" style="padding: 0 15px 0 15px;">
    <div class="col s12 white rounded" style="padding: 15px;">
        <div class="row">
            <div class="col s10">
                <h4>` + ponudba.vozilo.znamka + ` ` + ponudba.vozilo.model + `</h4>
            </div>
        </div>
        <div class="row">
            <div class="col m5 offset-m1 s12">
                <h5>Lokacija</h5>
                <div class="row normal-text">
                    <div class="col s12">
                        <span>Cena na km: ` + ponudba.vozilo.cena_na_km + `€</span>
                    </div>
                    <div class="col s12">
                        <span>Naložišče: ` + ponudba.nalozisce.ulica + ` ` + ponudba.nalozisce.stevilka + `, ` + ponudba.nalozisce.posta + ` ` + ponudba.nalozisce.kraj + `</span>
                    </div>
                    <div class="col s12">
                        <span>Čas naložitve: ` + datum + `</span>
                    </div>
                    <div class="col s12">
                        <span>Dostava: ` + ponudba.dostava.ulica + ` ` + ponudba.dostava.stevilka + `, ` + ponudba.dostava.posta + ` ` + ponudba.dostava.kraj + `</span>
                    </div>
                </div>
            </div>
            <div class="col m5 s12">
                <h5>Tovor</h5>
                <div class="row normal-text">` + tovor + `</div>
            </div>
        </div>
        ` + pripombe + `
        <div class="row">
            <div class="col s12">
                <h5>Naročnik: ` + ponudba.ime + ` ` + ponudba.priimek + `</h5>
            </div>
        </div>
        <div class="row">
            ` + controls + `
        </div>
    </div>
</div>`;
}

function getCardIskalec(ponudba) {
    let datum_full = new Date(ponudba.cas_nalozitve);
    let datum = `${String(datum_full.getHours()).padStart(2, '0')}:${String(datum_full.getMinutes()).padStart(2, '0')} ${String(datum_full.getDate()).padStart(2, '0')}.${String(datum_full.getMonth()+1).padStart(2, '0')}.${datum_full.getFullYear()}`;

    let status = "";
    switch (ponudba.status) {
        case "cakanje potrditve":
            status = "Čakanje potrditve";
            break;
        case "potrjeno":
            status = "Potrjena";
            break;
        case "koncano":
            status = "Končana";
            break;
        case "zavrnjeno":
            status = "Zavrnjena";
            break;
    }

    let tovor = "";
    switch (ponudba.tip_tovora) {
        case "palete":
            tovor = `<div class="col s12">
                    <span>Tip: Standardne palete</span>
                </div>
                <div class="col s12">
                    <span>Število palet: ` + ponudba.st_palet + `</span>
                </div>
                <div class="col s12">
                    <span>Teža palete: ` + ponudba.teza_palet + ` kg</span>
                </div>
                <div class="col s12">
                    <span>Skupna teža: ` + (ponudba.teza_palet * ponudba.st_palet) + ` kg</span>
                </div>`;
            break;
        case "posamezni izdelki":
            let teza = 0;
            let volumen = 0;
            for (const izdelek of ponudba.izdelki) {
                teza += izdelek.teza * izdelek.kolicina;
                volumen += izdelek.dolzina * izdelek.visina * izdelek.sirina;
            }
            tovor = `<div class="col s12">
                    <span>Tip: Posamezni izdelki</span>
                </div>
                <div class="col s12">
                    <span>Skupen volumen izdelkov: ` + volumen + ` cm<sup>3</sup></span>
                </div>
                <div class="col s12">
                    <span>Skupna teža izdelkov: ` + teza + ` kg</span>
                </div>`;
            break;
        case "razsut tovor":
            tovor = `<div class="col s12">
                    <span>Tip: Razsut tovor</span>
                </div>
                <div class="col s12">
                    <span>Volumen: ` + izdelek.volumen_tovora + ` m<sup>3</sup></span>
                </div>
                <div class="col s12">
                    <span>Teža: ` + izdelek.teza_tovora + ` kg</span>
                </div>`;
            break;
    }

    return `<div class="row" id="orderCard" style="padding: 0 15px 0 15px;">
    <div class="col s12 white rounded" style="padding: 15px;">
        <div class="row">
            <div class="col s10">
                <h4>` + ponudba.vozilo.znamka + ` ` + ponudba.vozilo.model + `</h4>
            </div>
        </div>
        <div class="row">
            <div class="col m5 offset-m1 s12">
                <h5>Lokacija</h5>
                <div class="row normal-text">
                    <div class="col s12">
                        <span>Cena na km: ` + ponudba.vozilo.cena_na_km + `€</span>
                    </div>
                    <div class="col s12">
                        <span>Naložišče: ` + ponudba.nalozisce.ulica + ` ` + ponudba.nalozisce.stevilka + `, ` + ponudba.nalozisce.posta + ` ` + ponudba.nalozisce.kraj + `</span>
                    </div>
                    <div class="col s12">
                        <span>Čas naložitve: ` + datum + `</span>
                    </div>
                    <div class="col s12">
                        <span>Dostava: ` + ponudba.dostava.ulica + ` ` + ponudba.dostava.stevilka + `, ` + ponudba.dostava.posta + ` ` + ponudba.dostava.kraj + `</span>
                    </div>
                </div>
            </div>
            <div class="col m5 s12">
                <h5>Tovor</h5>
                <div class="row normal-text">` + tovor + `</div>
            </div>
        </div>
        <div class="row">
            <div class="col s12 center-align">
                <h5>Status ponudbe: ` + status + `</h5>
            </div>
        </div>
        <div class="row">
            <div class="input-field col m3 offset-m7 s7">
                <select id="formatChoice">
                    <option value="pdf" selected>PDF datoteka</option>
                    <option value="txt">Tekstovna datoteka</option>
                </select>
            </div>
            <div class="input-field col m2 s5">
                <a class="waves-effect waves-light btn"
                    style="text-transform: none;" onclick="exportConfirmation(${ponudba.id})">Izvoz potrdila</a>
            </div>
        </div>
    </div>
</div>`;
}

async function exportConfirmation(id) {
    let ponudba;

    await $.ajax({
        method: "get",
        url: "/order/",
        dataType: "json"
    })
        .done(function (data) {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == id) {
                        ponudba = data[i];
                        break;
                    }
                }
            }
        });

    let datum_full = new Date(ponudba.cas_nalozitve);
    let datum = datum_full.getHours() + ":" + datum_full.getMinutes() + " " + datum_full.getDate() + "." + datum_full.getMonth() + "." + datum_full.getFullYear();

    var choice = document.getElementById("formatChoice").value;

    switch (choice) {
        case "txt":
            content = "Podatki o naročilu\n\nStatus naročila: " + ponudba.status + "\nVozilo: " +
                ponudba.vozilo.znamka + " " + ponudba.vozilo.model + " " + "\nPrice: " + ponudba.vozilo.cena_na_km +
                "\nDatum nalaganja: " + datum_full + "\nDatum izvoza: " + datum;

            switch (ponudba.tip_tovora) {
                case "palete":
                    let skupnaTeza = ponudba.teza_palet * ponudba.st_palet;
                    content += "\n\nTovor\nŠtevilo palet: " + ponudba.st_palet + "\nTeža palet: " + ponudba.teza_palet +
                        "\nSkupna teža: " + skupnaTeza;
                    break;
                case "posamezni izdelki":
                    let teza = 0;
                    let volumen = 0;
                    for (const izdelek of ponudba.izdelki) {
                        teza += izdelek.teza * izdelek.kolicina;
                        volumen += izdelek.dolzina * izdelek.visina * izdelek.sirina;
                    }
                    content += "\n\nTovor\nTeža: " + teza + "\nVolumen: " + volumen;
                    break;
                case "razsut tovor":
                    content += "\n\nTovor\nVolumen: " + izdelek.volumen_tovora + "\nTeža: " + izdelek.teza_tovora;
                    break;
            }

            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', "Izvoz naročila");

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
            break;
        case "pdf":
            var doc = new jsPDF();
            doc.setFont("Times", "Roman");
            doc.fromHTML($("#orderCard").get(0), 20, 20);
            doc.save("Izvoz naročila.pdf");
            break;
    }
}
