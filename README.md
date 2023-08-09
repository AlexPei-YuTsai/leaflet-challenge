# leaflet-challenge
> How can we create data visualizations of geographically positioned information?

> [So, the word I was looking for is a map, and you can see it through GitHub Pages!]()
## Folder Contents
- A `static` folder 

### Installation/Prerequisites
- As long as you have a browser that's compatible with post-ES6 Javascript, you should be able to run the website or pull the directory to run the HTML locally on your web browser.
#### Imported Modules
- Any dependencies we used are all pulled online from CDNs and official releases, but please refer to the links below if you want to examine the specific version used in this project or download the modules with NPM for work with Node.js:
  - 
  - [D3 v7](https://d3js.org/getting-started#d3-in-vanilla-html) to read JSON files and handle DOM tree element manipulation.

## View it Online
This project is hosted as a [GitHub Pages Website]() and can be viewed simply by clicking the hyperlink in this sentence. 

### Website Contents
Assuming everything loaded in correctly, there should be 

### Data Context
For any explanations on the metrics or units used and what any of the data means, please refer to the 

## Code Breakdown
As most of the reasoning and coding techniques are discussed at length in the comments of Javascript file, this part will be about the workflow of our data visualization project.

### Loading and Updating

D3 allows you to load in your data and, upon successfully loading in the data, do things to it:

```javascript
// Load data, have it handle Promises and that mess
d3.json(someURL).then(function (thatData){
  // Do stuff to the data

  // Example 1: Iteratively creating elements
  // You can use this to add list items, dropdown options, and anything with a variable amount of lines by using loops to do so
  for (let i=0; i<thatData.someArray.length; i++){
    // Adds elements with some iteratively defined features to a parent element
    d3.select("#someParentElement").append("someTag").text(data.someArray[i]).attr("someAttribute", someValue);
  };

  // ...
});
```


We've only barely scratched the surface with this demonstration, but there are plenty of other things you can do with D3 and Plotly. This is also done with the most basic of styling, so you can also make it prettier with a little time, effort, and documentation.

## Resources that helped a lot
- Official documentation for [Plotly (Javascript)](https://plotly.com/javascript/) is, unfortunately, terribly vague and unhelpful as they are a Python library first and Javascript API last. Many inquiries we had needed to be answered through a 3rd party source on the internet because they didn't demonstrate how to use their most basic functionalities on their website. Go figure.
  - For example, for some incomprehensible reason, `Plotly.update()`'s syntax doesn't work intuitively and you have to [wrap your updated content with an extra set of brackets](https://stackoverflow.com/a/60713918) to get it to work.
- As we are working in Javascript, frequent trips to their official documentation is *highly* encouraged and *actually* valuable.
  - Just a quick note: When using lambda/arrow functions to pass in dictionaries, make sure to [wrap them in parentheses so the compiler doesn't confuse it for a function you're calling](https://stackoverflow.com/a/40348205).
- [D3](https://d3js.org/), much like jQuery, is good for DOM tree traversal and manipulation. However, it's best for data visualization and usage in conjunction with graphing libraries such as Plotly.

## FINAL NOTES
> Project completed on August 3, 2023


leaflet has special setup https://courses.bootcampspot.com/courses/3533/pages/15-getting-started?module_item_id=962097

data and documentation from here: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

geojson help https://leafletjs.com/examples/geojson/