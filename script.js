//Karteninitialisierung
var map = L.map('map').setView([47.18, 8.28], 14);

//Kartenlayer (OpenStreetMap)
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

