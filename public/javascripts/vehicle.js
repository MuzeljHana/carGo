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
    return `<div class="row" style="padding: 0 15px 0 15px;">
<div class="col s12 white" style="border-radius: 10px; padding: 15px;">
    <div class="col s12 m4 valign-wrapper center-align">
        <img src="https://picsum.photos/500/350?random=1" alt="" class="responsive-img">
    </div>
    <div class="col s12 m8">
        <div class="row">
            <div class="col s10">
                <h4>` + vozilo.registracijska_st + `</h4>
            </div>
            <div class="col s2" style="margin-top: 25px;">
                <a class="waves-effect waves-light btn-flat right"><i
                        class="material-icons">close</i></a>
            </div>
        </div>
        <div class="row">
            <div class="col s4">
                <span>Cena: ` + vozilo.cena + `€/km</span>
            </div>
            <div class="col s4">
                <span>Aktivnost: ` + vozilo.aktivnost + `</span>
            </div>
            <div class="col s4">
                <span>Zaseden: ` + vozilo.zasedenost + `</span>
            </div>
        </div>
        <div class="row">
            <div class="col s4">
                <span>Dolžina: </span>
            </div>
            <div class="col s4">
                <span>Širina: </span>
            </div>
            <div class="col s4">
                <span>Višina: <span></span></span>
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
