// Map title layers
let greyscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// JSON url
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// JSON request
d3.json(url).then(function (data) {
    console.log(data);
    
    createFeatures(data.features);
});

// Size of marker and color
function markerSize(magnitude) {
    return magnitude * 100000;
};

function chooseColor(depth) {
    if (depth < 10) return "#64B5F6";
    else if (depth < 30) return "#43A047";
    else if (depth < 50) return "#FFF176";
    else if (depth < 70) return "#FB8C00";
    else if (depth < 90) return "#B71C1C";
    else return "#FF3300";
}

function createFeatures(earthquakeData) {

  // Making popup with quake data
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}
        </p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    // Running onEach for each part
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        // Point to layer used to alter markers
        pointToLayer: function (feature, latlng) {

            // Marker style
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                color: "black",
                stroke: true,
                weight: 1
            }
            return L.circle(latlng, markers);
        }
    });

    // Sending layer to Createmap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Making the base layers
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Making basemaks obj
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // overlayMaps to hold overlay
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // CCreating map and adding street and quake layers
    var myMap = L.map("map", {
        center: [41, 35],
        zoom: 3,
        layers: [street, earthquakes]
    });

    // Making layer control to use on base and overlay
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Creating the legend 
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4 style='text-align: center'>Legend by Depth (km)</h4>";
        div.innerHTML += '<i style="background: #64B5F6"></i><span>10 km or less</span><br>';
        div.innerHTML += '<i style="background: #43A047"></i><span>30 km or less</span><br>';
        div.innerHTML += '<i style="background: #FFF176"></i><span>50 km or less</span><br>';
        div.innerHTML += '<i style="background: #FB8C00"></i><span>70 km or less</span><br>';
        div.innerHTML += '<i style="background: #FF3300"></i><span>90 km or less</span><br>';
        div.innerHTML += '<i style="background: #B71C1C"></i><span>More than 90 km</span><br>';
            return div;
    };

    legend.addTo(myMap);
}
   
  