// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var map;
var totalMessage='Hello World!';
var infoWindow;
var pos;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 6
        });

    infoWindow = new google.maps.InfoWindow({map: map});
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent(totalMessage);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
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

socket.on('get users', function(data){
    google.maps.event.trigger(map, 'resize');
    map.setCenter(pos);
});

socket.on('new message', function(data){
    if(data.msg!=''){
        totalMessage = totalMessage+"<br />"+data.msg;
        addMessage(totalMessage);
    }
});