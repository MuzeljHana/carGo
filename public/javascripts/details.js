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
