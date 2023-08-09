// Defining JSON functions here
function makeFeature(feature){

};

// Get JSON Data
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(function(data){
  console.log(data);

  // Making map here, using BBOX to figure out where to center the map - centering via midpoint between min and max latitude/longitude
  let lng = (data.bbox[0]+data.bbox[3])/2
  let lat = (data.bbox[1]+data.bbox[4])/2
  let map = L.map("map").setView([lat, lng], 2);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
  }).addTo(map);

  // Defining geoJSON Marker options through a function to make circles with radii scaling with passed in argument.
  function geojsonMarkerOptions(number){
    return {
      radius: number*2,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } 

  // Because the data used follows proper GeoJSON formatting, we don't have to specify "data.features" and can have L.geoJson find where the features are by itself.
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
  }).addTo(map);

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

  // Adding the legend to the map
  legend.addTo(map);
  
});

