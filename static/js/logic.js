// Get JSON Data
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
url2 = "leaflet-challenge/GeoJSON/PB2002_boundaries.json";

// Quick URL thing: GitHub Pages has a slightly different URL system, so we need this line...
if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
  url2 = "GeoJSON/PB2002_boundaries.json";
};

// Run with Live Server to bypass CORS policy
Promise.all([
  d3.json(url),
  d3.json(url2)
]).then(function([data, borderData]){
  // Adding tilesets here
  let street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Defining geoJSON Marker options through a function to make circles with radii scaling with passed in argument.
  function geojsonMarkerOptions(number){
    return {
      radius: number*2,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } 

  // Because the data used follows proper GeoJSON formatting, we don't have to specify "data.features" and can have L.geoJson find where the features are by itself. Note: geojson is also an overlay layer.
  let geojson = L.choropleth(data, {

    //L.choropleth extends from L.geoJson, so any tricks done there can be transferred over here
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions(feature.properties.mag));
    },

    // Define which property in the features to use.
    valueProperty: function (feature) {
      return feature.geometry.coordinates[2]
    },

    // Set the color scale.
    scale: ["chartreuse", "yellow", "crimson"],

    // The number of breaks in the step range
    steps: 6,

    // q for quartile, e for equidistant, k for k-means
    // quartile used because of presence of great outliers
    mode: "q",

    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a popup to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        `<b>Time Occurred:</b> ${new Date(feature.properties.time).toString()}
        <hr>
        <b>Latitude:</b> ${feature.geometry.coordinates[1]}<br>
        <b>Longitude:</b> ${feature.geometry.coordinates[0]}<br>
        <b>Depth:</b> ${feature.geometry.coordinates[2]}km<br>
        <b>Magnitude:</b> ${feature.properties.mag}`
      )
    }
  })

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = geojson.options.limits;
    let colors = geojson.options.colors;
    let labels = [];

    let legendInfo = "<h3>Depth (km) of Earthquake Events for the past 7 days:</h3>";

    div.innerHTML = legendInfo;

    // Passing in color blocks and text to be added to the DOM per limit that exists
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>"+"  "+(Math.round(limit * 100) / 100)+"<br>");
    });

    // Throws all li items into a big ul item and append it to the title of the legend box
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Make new layer
  let borderjson = L.geoJSON(borderData);

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    "Earthquakes": geojson,
    "Tectonic Boundaries":borderjson
  };

  // Making map here, using BBOX to figure out where to center the map - centering via midpoint between min and max latitude/longitude
  let lng = (data.bbox[0]+data.bbox[3])/2
  let lat = (data.bbox[1]+data.bbox[4])/2

  // Defining what layers to load in on default
  let map = L.map("map", {
    center: [lat, lng],
    zoom: 2,
    layers: [street, borderjson, geojson]
  });

  // Adding the legend to the map
  legend.addTo(map);

  // Adding layer control
  let layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);

  // It's a little hacky, but this makes sure the circle markers stay on top
  map.on("overlayadd", function (event) {
    geojson.bringToFront();
  });
});

