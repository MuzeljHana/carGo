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

        }
    });
