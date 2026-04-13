//Karteninitialisierung
var map = L.map('map').setView([47.18, 8.28], 14);

//Kartenlayer (OpenStreetMap)
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker;
var watchId = null;

var standortIcon = L.divIcon({
    className: "standort-marker-blau",
    html: '<div style="width: 10px; height: 10px; background: #1a73e8; border: 2px solid white; border-radius: 50%; box-shadow: 0px 0px 6px rgba(0,0,0,0.3);"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
})


function zeigeStandort() {
    if (watchId !== null) {
        return;
    }

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(

            function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                map.setView([lat, lng], 16);

                if (!marker) {
                    marker = L.marker([lat, lng], { icon: standortIcon }).addTo(map);
                }
                else {
                    marker.setLatLng([lat, lng]);
                }
            },

            function (error) {
                alert("Standort konnte nicht dauerhaft überwacht werden!");
            },
            {
                enableHighAccuracy: true
            }
        );
    }
    else {
        alert("GPS wird nicht unterstützt!");
    }
}


//Massstabsbalken
L.control.scale({
    position: "bottomright",
    imperial: false //
}).addTo(map);