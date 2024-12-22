
let VictoriaLat = 48.42852367220667;
let VictoriaLong = -123.36910754508783;

let interurbanLat = 48.48976711945971;
let interurbanLong = -123.41535236038402;

let lansdowneLat =48.44806311773512 ;
let lansdowneLong =-123.32272797572601;

let mtdouglat = 48.494271670721886;
let mtdouglong = -123.34694157276583;

var map = L.map('map',{zoomControl:false}).setView([VictoriaLat, VictoriaLong], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.scale().addTo(map);

var victoriaMarker = L.marker([VictoriaLat,VictoriaLong]).addTo(map);
var interurbanMarker = L.marker([interurbanLat,interurbanLong]).addTo(map);




var popup = L.popup();

function onMapClick(e){
    let currentLat = e.latlng.lat;
    let currentLong = e.latlng.lng; 
    console.log(currentLat);
    let apiKey = `cd0a8044e59eec1c99a47b763c07235a`;
    let weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLong}&appid=${apiKey}`;
    let getWeather = async() => {
        let response = await fetch(weatherURL);
        let data = await response.json();
        console.log(data);
        popup.setLatLng(e.latlng);
        popup.setContent("The Weather over here is: " + (data.main.temp -273.15).toFixed(2));
        popup.openOn(map);
    }
    getWeather();
}
map.on('click', onMapClick);

