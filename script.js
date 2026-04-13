//Karteninitialisierung
var map = L.map('map').setView([47.18, 8.28], 14);

//Kartenlayer (OpenStreetMap)
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker;

function zeigeStandort() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            map.setView([lat, lng], 16);

            if (marker) {
                map.removeLayer(marker);
            }

            marker = L.marker([lat, lng]).addTo(map);
        },

        function (error) {
            alert("Standort konnte nicht abgerufen werden!");
        }
    );
}

//Massstabsbalken
L.control.scale({
    position: "bottomright",
    imperial: false //
}).addTo(map);