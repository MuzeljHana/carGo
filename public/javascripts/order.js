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
        url: `/order/${id}/status/potrjeno`,
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
        url: `/order/${id}/status/zavrnjeno`,
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
        url: `/order/${id}/status/koncano`,
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
                <p>${ponudba.pripombe}</p>
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
                    <span>??tevilo palet: ${ponudba.st_palet}</span>
                </div>
                <div class="col s12">
                    <span>Te??a palete: ${ponudba.teza_palet} kg</span>
                </div>
                <div class="col s12">
                    <span>Skupna te??a: ${(ponudba.teza_palet * ponudba.st_palet)} kg</span>
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
                    <span>Skupen volumen izdelkov: ${volumen} cm<sup>3</sup></span>
                </div>
                <div class="col s12">
                    <span>Skupna te??a izdelkov: ${teza} kg</span>
                </div>`;
            break;
        case "razsut tovor":
            tovor = `<div class="col s12">
                    <span>Tip: Razsut tovor</span>
                </div>
                <div class="col s12">
                    <span>Volumen: ${ponudba.volumen_tovora} m<sup>3</sup></span>
                </div>
                <div class="col s12">
                    <span>Te??a: ${ponudba.teza_tovora} kg</span>
                </div>`;
            break;
    }

    controls = `<div class="col s12 center-align">
        <a onclick="potrdi(${ponudba.id})" class="waves-effect waves-light btn">Potrdi</a>
        <a onclick="zavrni(${ponudba.id})" class="waves-effect waves-dark btn red">Zavrni</a>
    </div>`;
    if (ponudba.status == "potrjeno") {
        controls = `<div class="col s12 center-align">
            <a onclick="zakljuci(${ponudba.id})" class="waves-effect waves-light btn">Zaklju??i</a>
        </div>`
    }

    return `<div class="row" style="padding: 0 15px 0 15px;">
    <div class="col s12 white rounded" style="padding: 15px;">
        <div class="row">
            <div class="col s10">
                <h4>${ponudba.vozilo.znamka} ${ponudba.vozilo.model}</h4>
            </div>
        </div>
        <div class="row">
            <div class="col m5 offset-m1 s12">
                <h5>Lokacija</h5>
                <div class="row normal-text">
                    <div class="col s12">
                        <span>Cena na km: ${ponudba.vozilo.cena_na_km}???</span>
                    </div>
                    <div class="col s12">
                        <span>Nalo??i????e: ${ponudba.nalozisce.ulica} ${ponudba.nalozisce.stevilka}, ${ponudba.nalozisce.posta} ${ponudba.nalozisce.kraj}</span>
                    </div>
                    <div class="col s12">
                        <span>??as nalo??itve: ${datum}</span>
                    </div>
                    <div class="col s12">
                        <span>Dostava: ${ponudba.dostava.ulica} ${ponudba.dostava.stevilka}, ${ponudba.dostava.posta} ${ponudba.dostava.kraj}</span>
                    </div>
                </div>
            </div>
            <div class="col m5 s12">
                <h5>Tovor</h5>
                <div class="row normal-text">${tovor}</div>
            </div>
        </div>
        ${pripombe}
        <div class="row">
            <div class="col s12">
                <h5>Naro??nik: ${ponudba.ime} ${ponudba.priimek}</h5>
            </div>
        </div>
        <div class="row">
            ${controls}
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
            status = "??akanje potrditve";
            break;
        case "potrjeno":
            status = "Potrjena";
            break;
        case "koncano":
            status = "Kon??ana";
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
                    <span>??tevilo palet: ${ponudba.st_palet}</span>
                </div>
                <div class="col s12">
                    <span>Te??a palete: ${ponudba.teza_palet} kg</span>
                </div>
                <div class="col s12">
                    <span>Skupna te??a: ${(ponudba.teza_palet * ponudba.st_palet)} kg</span>
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
                    <span>Skupen volumen izdelkov: ${volumen} cm<sup>3</sup></span>
                </div>
                <div class="col s12">
                    <span>Skupna te??a izdelkov: ${teza} kg</span>
                </div>`;
            break;
        case "razsut tovor":
            tovor = `<div class="col s12">
                    <span>Tip: Razsut tovor</span>
                </div>
                <div class="col s12">
                    <span>Volumen: ${ponudba.volumen_tovora} m<sup>3</sup></span>
                </div>
                <div class="col s12">
                    <span>Te??a: ${ponudba.teza_tovora} kg</span>
                </div>`;
            break;
    }

    return `<div class="row" id="orderCard${ponudba.id}" style="padding: 0 15px 0 15px;">
    <div class="col s12 white rounded" style="padding: 15px;">
        <div class="row">
            <div class="col s10">
                <h4>${ponudba.vozilo.znamka} ${ponudba.vozilo.model}</h4>
            </div>
        </div>
        <div class="row">
            <div class="col m5 offset-m1 s12">
                <h5>Lokacija</h5>
                <div class="row normal-text">
                    <div class="col s12">
                        <span>Cena na km: ${ponudba.vozilo.cena_na_km}???</span>
                    </div>
                    <div class="col s12">
                        <span>Nalo??i????e: ${ponudba.nalozisce.ulica} ${ponudba.nalozisce.stevilka}, ${ponudba.nalozisce.posta} ${ponudba.nalozisce.kraj}</span>
                    </div>
                    <div class="col s12">
                        <span>??as nalo??itve: ${datum}</span>
                    </div>
                    <div class="col s12">
                        <span>Dostava: ${ponudba.dostava.ulica} ${ponudba.dostava.stevilka}, ${ponudba.dostava.posta} ${ponudba.dostava.kraj}</span>
                    </div>
                </div>
            </div>
            <div class="col m5 s12">
                <h5>Tovor</h5>
                <div class="row normal-text">${tovor}</div>
            </div>
        </div>
        <div class="row">
            <div class="col s12 center-align">
                <h5>Status ponudbe: ${status}</h5>
            </div>
        </div>
        <div class="row" data-html2canvas-ignore="true">
            <div class="input-field col m3 offset-m7 s7">
                <select id="formatChoice${ponudba.id}">
                    <option value="pdf" selected>PDF datoteka</option>
                    <option value="txt">Tekstovna datoteka</option>
                </select>
            </div>
            <div class="input-field col m2 s5" data-html2canvas-ignore="true">
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

    var choice = document.getElementById('formatChoice'+id).value;

    switch (choice) {
        case "txt":
            content = "Podatki o naro??ilu\n\nStatus naro??ila: " + ponudba.status + "\nVozilo: " +
                ponudba.vozilo.znamka + " " + ponudba.vozilo.model + " " + "\nCena: " + ponudba.vozilo.cena_na_km +
                "\nDatum nalaganja: " + datum_full;

            switch (ponudba.tip_tovora) {
                case "palete":
                    let skupnaTeza = ponudba.teza_palet * ponudba.st_palet;
                    content += "\n\nTovor\n??tevilo palet: " + ponudba.st_palet + "\nTe??a palet: " + ponudba.teza_palet +
                        "\nSkupna te??a: " + skupnaTeza;
                    break;
                case "posamezni izdelki":
                    let teza = 0;
                    let volumen = 0;
                    for (const izdelek of ponudba.izdelki) {
                        teza += izdelek.teza * izdelek.kolicina;
                        volumen += izdelek.dolzina * izdelek.visina * izdelek.sirina;
                    }
                    content += "\n\nTovor\nTe??a: " + teza + "\nVolumen: " + volumen;
                    break;
                case "razsut tovor":
                    content += "\n\nTovor\nVolumen: " + ponudba.volumen_tovora + "\nTe??a: " + ponudba.teza_tovora;
                    break;
            }

            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', "Izvoz naro??ila");

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
            break;
        case "pdf":
            let doc = new jsPDF('p', 'mm');
            let orderCard = $('#orderCard'+id);

            html2canvas(orderCard, {
                scale: 0.5,
                height: 500,
                width: 900
            }).then(function(canvas) {
                document.body.appendChild(canvas);
                let imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 0, 0, 200, 111);
                doc.save('Izvoz naro??ila.pdf');
                document.body.removeChild(canvas);
            });
            break;
    }
}
