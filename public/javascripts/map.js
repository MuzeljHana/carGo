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

function setStart(name) {
    geocoder.geocode(name, (data) => {
        let res = data[0].center;
        control.spliceWaypoints(0, 1, L.latLng(res.lat, res.lng));
    })
}

function setEnd(name) {
    geocoder.geocode(name, (data) => {
        let res = data[0].center;
        control.spliceWaypoints(1, 1, L.latLng(res.lat, res.lng));
    })
}
