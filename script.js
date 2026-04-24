//Karteninitialisierung
var map = L.map('map').setView([47.18, 8.28], 14);

//Kartenlayer (OpenStreetMap)
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var standortMarker = null;
var watchId = null;
var aktuelleLat = null;
var aktuelleLng = null;

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

                aktuelleLat = lat;
                aktuelleLng = lng;

                map.setView([lat, lng], 16);

                if (!standortMarker) {
                    standortMarker = L.marker([lat, lng], { icon: standortIcon }).addTo(map);
                }
                else {
                    standortMarker.setLatLng([lat, lng]);
                }
                if (gespeichert == true) {
                    postenerkennung(lat, lng);
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
map.on("click", function (e) {
    if (gespeichert) {
        alert("Die Posten wurden bereits gespeichert. Es können keine neuen Posten mehr hinzugefügt werden.");
        return;
    }
    var neuerMarker = new L.marker([e.latlng.lat, e.latlng.lng], {
        draggable: true,
        icon: blauesIcon
    }).addTo(map);

    neuerMarker.id = id;
    id = id + 1;
    neuerMarker.erkannt = false;
    alert("Marker ID: " + neuerMarker.id);

    markerListe.push(neuerMarker);
})

//Rückgängig
function rueckgaengig() {
    if (gespeichert == true) {
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
    if (gespeichert == true) {
        alert("Die Posten wurden bereits gespeichert. Wiederherstellen ist nicht mehr möglch.")
        return;
    }

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

//Speichern der Posten
var gespeichert = false;

function speichern() {
    if (markerListe.length == 0) {
        alert("Keine Marker zum Speichern vorhanden");
        return;
    }
    markerListe.forEach(function (marker) {
        marker.dragging.disable();
    });
    gespeichert = true;

    if (aktuelleLat !== null && aktuelleLng !== null) {
        postenerkennung(aktuelleLat, aktuelleLng);
    }

    alert("Alle Posten wurden gespeichert. Sie können nun nicht mehr verschoben werden.");
}

//Blauer Marker
var blauesIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//Grüner Marker
var gruenesIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//Ton
var ton = new Audio("ton.mp3");

//Postenerkennung
function postenerkennung(lat, lng) {
    markerListe.forEach(function (marker) {
        var markerPosition = marker.getLatLng();
        var distanz = map.distance([lat, lng], markerPosition);

        console.log("Distanz zu Marker " + marker.id + ": " + distanz.toFixed(2) + " m");

        if (distanz < 20) {
            if (!marker.erkannt) {
                marker.setIcon(gruenesIcon);
                marker.erkannt = true;
                ton.play();

                alert("Posten erreicht! Marker ID: " + marker.id);
            }
        }
    });
}

var startZeit = null;
var timer = null;
var laufAktiv = false;

function start() {
    if (gespeichert == false) {
        alert("Bitte speichere zuerst die Posten, bevor du den Lauf startest.");
        return;
    }

    if (laufAktiv == true) {
        alert("Die Zeit läuft bereits.");
        return;
    }

    startZeit = new Date();
    laufAktiv = true;

    timer = setInterval(function () {
        var aktuelleZeit = new Date();
        var zeitInMillisekunden = aktuelleZeit - startZeit;

        zeitAnzeigen(zeitInMillisekunden);
    }, 1000); // Aktualisierung/Führt die Funtkion alle 1 Sekunde aus

}

function stop() {
    if (laufAktiv == false) {
        alert("Die Zeit läuft derzeit nicht.");
        return;
    }
    clearInterval(timer);
    laufAktiv = false;
}

function zeitAnzeigen(zeitInMillisekunden) {
    var sekundenGesamt = Math.floor(zeitInMillisekunden / 1000);
    var stunden = Math.floor(sekundenGesamt / 3600);
    var minuten = Math.floor((sekundenGesamt % 3600) / 60);
    var sekunden = sekundenGesamt % 60;

    if (stunden < 10) {
        stunden = "0" + stunden;
    }

    if (minuten < 10) {
        minuten = "0" + minuten;
    }

    if (sekunden < 10) {
        sekunden = "0" + sekunden;
    }
    document.getElementById("zeitAnzeige").innerHTML = stunden + ":" + minuten + ":" + sekunden;

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