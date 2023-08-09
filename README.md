# Leaflet Challenge
> How can we create data visualizations of geographically positioned information?

> [So, the word I was looking for is a map, and you can view it through GitHub Pages!](https://alexpei-yutsai.github.io/leaflet-challenge/) If the link doesn't work for some reason, it's probably due to how GitHub Pages and Jekyll can't make up their minds about interpretting relative paths.
## Folder Contents
- A `static` folder with all the CSS and Javascript code to be accessed as well as any libraries downloaded. All logic is from the `logic.js` file, as the name might suggest.
- A `GeoJSON` folder with GeoJSON information regarding the Earth's tectonic plates downloaded from [Fraxen's repository](https://github.com/fraxen/tectonicplates).
- An `index.html` file that calls the static files to render the map on the website.

### Installation/Prerequisites
- As long as you have a browser that's compatible with post-ES6 Javascript, you should be able to run the website or pull the directory to run the HTML locally on your web browser.
- To run it locally, however, you will need to get the [Live Server VSCode extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and run the HTML file with `Right Click > Open with Live Server` as your browser's CORS policy may prevent the scripts from accessing local files.

![The command in question](https://cdn.discordapp.com/attachments/939673945240637450/1138951428493283518/image.png)
#### Imported Modules
- Any dependencies we used are all pulled online from CDNs and official releases, but please refer to the links below if you want to examine the specific version used in this project or download the modules with NPM for work with Node.js:
  - [Leaflet](https://leafletjs.com/examples/quick-start/) to produce the maps for this project.
    - The [Leaflet-Choropleth](https://github.com/timwis/leaflet-choropleth) has nonexistent documentation, but, because it extends from the Leaflet classes, commands and tricks that work with the Parent also work here. 
  - [D3 v7](https://d3js.org/getting-started#d3-in-vanilla-html) to read JSON files and handle DOM tree element manipulation.

## View it Online
This project is hosted as a [GitHub Pages Website](https://alexpei-yutsai.github.io/leaflet-challenge/) and can be viewed simply by clicking the hyperlink in this sentence. 

### Website Contents
Assuming everything loaded in correctly, there should be a street map representation of the Earth with the borders of the world's tectonic plates and a collection of circular markers each representing an earthquake event that happened sometime in the last week visible by default. This map can be panned and zoomed in to the user's liking.

In the bottom right corner, there should be a legend indicating what the colors of the map's circles mean. In the top right corner, there should be a layer control panel that allows the user to toggle on and off the markers and borders as well as an option to switch to a topological representation of the Earth. 

Clicking on any of the circular markers should reveal a pop-up with some details about the seismic occurrence in question. Do note that the screenshot below may not be an accurate representation of what you'll actually see as the data is *live* data collected from the [United States Geological Survey](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).

![The expected visualization displayed when successfully running the project. A single popup shows what to expect when one of the datapoints on the map is clicked.](https://cdn.discordapp.com/attachments/939673945240637450/1138944229570265198/image.png)

### Data Context
For any explanations on the metrics or units used and what any of the data means, please refer to the [USGS's documentation](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).

## Code Breakdown
As most of the reasoning and coding techniques are discussed at length in the comments of Javascript file, this part will be about the workflow of our data visualization project. Frankly, any explanations are best found in Leaflet's documentation much like how the inner workings of Frankenstein's monster are best inquired from its maker. However, I'll try to illustrate what I happened to digest.

As per usual, we start by importing data.

```javascript
// Load data, have it handle Promises and that mess
d3.json(someURL).then(function (thatData){
  // Do stuff to the data
});
```

Then, we can treat the data simply by letting Leaflet handle the parsing. Assuming the data you import follows a proper GeoJSON format, there should be no issue with finding the coordinates for your points. This also means that any data read should follow [proper GeoJSON format encoding](https://geojson.org/) and be converted accordingly. The same applies to the `L.choropleth` function as it's an extension of Leaflet's `L.geoJson` function.

```javascript
// Within the d3.json's then function:

// Define how each individual data point should be rendered.
// Optionally, you can also pass in a value and have it affect the appearance of the marker. For example: changing the size of a marker based on a certain statistic.
function markerOptions(value){
  return {
    radius:doSomeKindOfMath(value),
    someOtherOption:someOtherValue,
    ...
  };
};

// You're passing in your GeoJSON data and a dictionary of instructions to the function
L.choropleth(data, {
  // This is a Leaflet trick, but it also works with the Plugin.
  pointToLayer: function(feature, coordinates){
    // This function automatically reads through each item in the "feature" array of a GeoJSON object. All you have to do is tell it what part of the item to read.
    return L.circleMarker(coordinates, markerOptions(feature.someValueHere));
  },

  // We can use Leaflet-Choropleth to then color those processed circleMarkers based on another value
  valueProperty:function(feature){
    return feature.someOtherPropertyHere
  }

  scale:[color1, color2, moreColorsIfYouWantMoreBreakPoints],
  moreOptions:moreValues,
  ...

  // Typically, this option is used to make clickable popups for each datapoint, but you can also add event listeners and other functionality to spice up your project.
  onEachFeature:function(feature, layer){
    layer.bindPopup(//Do something here);
  }
});
```

There are many other things that can be done with Leaflet, however, as the creator of Leaflet himself said, this library is very lightweight, so any other functionality should be imported from [a third party](https://leafletjs.com/plugins.html).

## Resources that helped a lot
- Official documentation for [Leaflet](https://leafletjs.com/reference.html) is slightly hard to navigate, but is reasonably comprehensive for a person who has had some experience handling other Javascript libraries and modules. The examples, however, are very intuitive and easy to understand and much of the code in this project is produced by appropriating sample code from both [Leaflet](https://leafletjs.com/examples/geojson/) and [Leaflet-Choropleth's](https://github.com/timwis/leaflet-choropleth/tree/gh-pages/examples) demonstrations and adapting them for whatever I need.
- However, you'll still need to fill in the gaps with trips to the internet. Here are some links I found useful.
  - [Preserving layer order with Leaflet's layer control](https://gis.stackexchange.com/questions/183914/how-to-keep-vector-layer-on-top-of-all-layers-despite-toggling-order). I believe layers are "appended" to the DOM tree with Leaflet's implementation, so this fairly hacky solution was necessary to ensure the layer orders stay consistent.
  - [Loadung multiple files in D3](https://stackoverflow.com/a/70630081). I had to load data from 2 different JSON sources, so this was necessary.

## FINAL NOTES
> Project completed on August 3, 2023
