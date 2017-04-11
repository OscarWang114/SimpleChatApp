var map;
var totalMessage='Hello World!';
var taipeiPos = {lat: 25.105497,lng: 121.597366};
var infoWindow;
var iwPos = taipeiPos;
var mapPos = {lat: taipeiPos.lat+1.5, lng: taipeiPos.lng};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
            center: mapPos,
            zoom: 6
        });

    infoWindow = new google.maps.InfoWindow({map: map});
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            iwPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            mapPos = {
                lat: position.coords.latitude+1.5,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(iwPos);
            infoWindow.setContent(totalMessage);
            map.setCenter(mapPos);
        }, function() {
            handleLocationError(true, infoWindow, iwPos);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, iwPos);
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function addMessage(totalMessage){
    infoWindow.setContent(totalMessage);
}

function updateMyMap(){
    google.maps.event.trigger(map, 'resize');
    map.setCenter(mapPos);
}