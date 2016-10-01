        var map = "";
        var placeName = "";
        var placeAddress = "";
        var placeLat = 0;
        var placeLng = 0;
        var placeIcon = "";

        var markers = [];
        var itemPositions = [];
      function addMarkers() {
        var itemMarker, i;
        var infowindow = new google.maps.InfoWindow;
    database.ref("users/"+uid+"/list").on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          itemMarker = new google.maps.Marker({
            position: {lat: childSnapshot.val().location.lat, lng: childSnapshot.val().location.lng},
            map: map,
            icon: childSnapshot.val().location.icon
          });
          google.maps.event.addListener(itemMarker, "click", function() {
              infowindow.setContent('<div><strong>' + childSnapshot.val().itemName + '</strong><br>' +
                childSnapshot.val().location.name + '<br><br>'+childSnapshot.val().location.address+'</div>');
              infowindow.open(map, this);
 
          });


      });
    });
      }
$(document).ready(function() {

// $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBWJnUz-1fZ9d5kl1xnzkE-I1Ouy5PXvfM&libraries=places', function() {
  // google.load('maps', '3.25', { other_params: 'key=AIzaSyBWJnUz-1fZ9d5kl1xnzkE-I1Ouy5PXvfM&libraries=places', callback: function() {
  function initAutocomplete() {
          map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.09024, lng: -95.712891},
          zoom: 4,
          mapTypeId: 'roadmap'
        });
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var infowindow = new google.maps.InfoWindow();
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };
            var marker = new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location,
              address: place.formatted_address
            });

            // Create a marker for each place.
            markers.push(marker);

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
                        google.maps.event.addListener(marker, 'click', function() {
                          placeName = place.name;
                          placeAddress = place.formatted_address;
                          placeLat = place.geometry.location.lat();
                          placeLng = place.geometry.location.lng();
                          placeIcon = icon;
                          console.log(placeLat, placeLng);
              infowindow.setContent('<div><strong>' + placeName + '</strong><br>' +
                placeAddress + '<br><br><button class="add-place">Add Place</button></div>');
              infowindow.open(map, this);
            });
          });
          map.fitBounds(bounds);
        });

      }
// }});
// });
      function geolocate() {
            function success(position) {

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        map.panTo({lat: latitude, lng: longitude});
        map.setZoom(14);
        var marker = new google.maps.Marker({
          position: {lat: latitude, lng: longitude},
          map: map,
          title: 'Hello World!'
        });        
}
    function error() {
      console.log("womp womp");
}
        navigator.geolocation.getCurrentPosition(success, error);

      }
      function deleteMarkers() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }
        $(document).on("click", "#locations", function() {
          $("#pac-input").blur();
          $("#pac-input").val("");
          $("#pac-input").focus();
    // show($("#map"));
    // show($("#pac-input"));
    // show($("#geolocate"));
           deleteMarkers();
           google.maps.event.trigger(map, 'resize');
        map.panTo({lat: 37.09024, lng: -95.712891});
        map.setZoom(4);
});
        $(document).on("click", "#geolocate", function() {
          geolocate();
        });
        $(document).on("click", ".add-place", function() {
            // hide($("#map"));
            // hide($("#pac-input"));
            // hide($("#geolocate"));
            $("#placeName").val(placeName);
            $("#placeAddress").val(placeAddress);
            show($("#placeName"));
            show($("#placeAddress"));

        })
$("#map").ready(function() {
      initAutocomplete();

});
});
