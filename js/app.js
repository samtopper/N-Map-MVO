var model = {

  locations: [
    {
      title: 'Charminar',
      location: { lat: 17.361555, lng: 78.474666 }
    },
    {
      title: 'SalarJung Museum',
      location: { lat: 17.371436, lng: 78.480347 }
    },
    {
      title: 'Golconda Fort',
      location: { lat: 17.385363, lng: 78.40413 }
    },
    {
      title: 'Nehru Zoological Park',
      location: { lat: 17.348305, lng: 78.442511 }
    },
    {
      title: 'Qutub Shahi Tombs',
      location: { lat: 17.394746, lng: 78.394717 }
    },
    {
      title: 'Ocean Park',
      location: { lat: 17.389672, lng: 78.328797 }
    },
    {
      title: 'Snow World',
      location: { lat: 17.414365, lng: 78.48341 }
    },
    {
      title: 'Ramoji Film City',
      location: { lat: 17.255826, lng: 78.682419 }
    },
    {
      title: 'Hi Tech City',
      location: { lat: 17.446831, lng: 78.376585 }
    },
    {
      title: 'Falaknuma Palace',
      location: { lat: 17.330955, lng: 78.467504 }
    },
    {
      title: 'MGBS',
      location: { lat: 17.379872, lng: 78.48301 }
    },
    {
      title: 'RG International Airport',
      location: { lat: 17.240263, lng: 78.429385 }
    }
  ]
};

var octopus = {

  init: function(){
    // This Map constructor creates a new Map.
    var map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:17.401481, lng:78.450091},
        zoom: 13,
        mapTypeControl: false
    });
    locationsView.init();
    locationsListView.init();
  }

  // This function takes in a color, and then creates a new marker icon of that color.
  makeMarkerIcon: function(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(22, 35),  // 22 px wide by 35 px high.
      new google.maps.Point(0, 0),   // origin to (0,0)
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  // This function takes the input value in the find nearby area text input
  // locates it, and then zooms into that area. This is so that the user can
  // show all listings, then decide to focus on one area of the map.
  zoomToArea: function() {
  // Initialize the geocoder.
  var geocoder = new google.maps.Geocoder();
  // Get the address or place that the user entered.
  var address = document.getElementById('zoom-to-area-text').value;
  // Make sure the address isn't blank.
  if (address == '') {
    window.alert('You must enter an area, or address.');
  } else {
    // Geocode the address/area entered to get the center. Then, center the map
    // on it and zoom in
    geocoder.geocode(
      { address: address,
        componentRestrictions: {locality: 'Hyderabad'}
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        } else {
          window.alert('We could not find that location - try entering a more' +
              ' specific place.');
        }
      });
  }

  // This function populates the infowindow when the marker is clicked.
  populateInfoWindow: function(marker, infowindow) {
      // Checking the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // clearing the marker property if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
      }
  }

  // looping through the markers array and displaying them.
  showListings: function() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0, len = markers.length; i < len; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  // loop through the listings and hiding them.
  hideListings: function() {
    for (var i = 0, len = markers.length; i < len; i++) {
      markers[i].setMap(null);
    }
  }

};

var locationsView = {

  init: function(){
    // Create a new array for all the listing markers.
    var markers = [];
    var largeInfowindow = new google.maps.InfoWindow();
    var defaultIcon = octopus.makeMarkerIcon('1D97C4');
    // Highlighting the marker when the user mouses over.
    var highlightedIcon = octopus.makeMarkerIcon('AAE12C');

    // this for loop creates an array of markers on initialization.
    for (var i = 0, len = model.locations.length; i < len; i++) {
      // Get the position from the location array.
      var position = model.locations[i].location;
      var title = model.locations[i].title;
      // Create a marker per location, and put into markers array.
       var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        octopus.populateInfoWindow(this, largeInfowindow);
      });
      // Two event listeners to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
    }

    document.getElementById('show-listings').addEventListener('click', octopus.showListings);
    document.getElementById('hide-listings').addEventListener('click', octopus.hideListings);
    document.getElementById('zoom-to-area').addEventListener('click', function() {
      octopus.zoomToArea();
  }

};

var locationsListView = {

};

//start
octopus.init();

