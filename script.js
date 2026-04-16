//Karteninitialisierung
var map = L.map('map').setView([47.18, 8.28], 14);

//Kartenlayer (OpenStreetMap)
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var standortMarker = null;
var watchId = null;

//Benutzerdefiniertes Standorticon (blauer Punkt)
var standortIcon = L.divIcon({
    className: "standort-marker-blau",
    html: '<div style="width: 10px; height: 10px; background: #1a73e8; border: 2px solid white; border-radius: 50%; box-shadow: 0px 0px 6px rgba(0,0,0,0.3);"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
})

//Funktion zur Anzeige des Live Standorts
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

                if (!standortMarker) {
                    standortMarker = L.marker([lat, lng], { icon: standortIcon }).addTo(map);
                }
                else {
                    standortMarker.setLatLng([lat, lng]);
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

var markerListe = [];
var geloeschteMarker = [];
var id = 0;

//Benutzerdefinierter Marker, welcher verschoben werden kann
map.on("click", function(e) {
    if (gespeichert) {
    alert("Die Posten wurden bereits gespeichert. Es können keine neuen Posten hinzugefügt werden.");
    return;
    var neuerMarker = new L.marker([e.latlng.lat, e.latlng.lng],{
        draggable: true
    }).addTo(map);
    
    neuerMarker.id = id;
    id = id + 1;    
    alert("Marker ID: " + neuerMarker.id);
   
    markerListe.push(neuerMarker);
})

//Rückgängig
function rueckgaengig() {
    if (gespeichert) {
        alert("Die Posten wurden bereits gespeichert. Rückgängig ist nicht mehr möglch.")
        return;
    }
     // Prüfen, ob Marker vorhanden sind
    if (markerListe.length > 0) {
        var letzterMarker = markerListe.pop();
        map.removeLayer(letzterMarker);
        geloeschteMarker.push(letzterMarker);

        alert("Marker entfernt (ID: " + letzterMarker.id + ")");
    }
    else {
        alert("Keine Marker zum Entfernen vorhanden");
    }
}


//Wiederherstellen
function wiederherstellen() {
    if (geloeschteMarker.length > 0) {
        var marker = geloeschteMarker.pop();
        marker.addTo(map);
        markerListe.push(marker);

        alert("Marker wiederhergestellt (ID: " + marker.id + ")");
    }
    else {
        alert("Keine Marker zum Wiederherstellen vorhanden");
    }
}

var gespeichert = false;

function speichern() {
    gespeichert = true;
    if (markerListe.length == 0){
        alert("Keine Marker zum Speichern vorhanden");
        return;
    }
    markerListe.forEach(function(marker){
        marker.dragging.disable();
    });
    alert("Alle Posten wurden gespeichert. Sie können nun nicht mehr verschoben werden.");
}

//Massstabsbalken
L.control.scale({
    position: "bottomright",
    imperial: false //
}).addTo(map);

var options = {
    position: "topright",
};
L.control.locate(options).addTo(map);