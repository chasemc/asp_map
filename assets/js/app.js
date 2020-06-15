var map, featureList;


// page setup
$(window).resize(function() {
    sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
    $(document).off("mouseout", ".feature-row", clearHighlight);
});

if (!("ontouchstart" in window)) {
    $(document).on("mouseover", ".feature-row", function(e) {
        highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
    });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
    $("#aboutModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

$("#legend-btn").click(function() {
    $("#legendModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

$("#list-btn").click(function() {
    $(".navbar-collapse").collapse("toggle");
    animateSidebar();
    return false;
});

$("#nav-btn").click(function() {
    $(".navbar-collapse").collapse("toggle");
    return false;
});

$("#sidebar-toggle-btn").click(function() {
    animateSidebar();
    return false;
});

$("#sidebar-hide-btn").click(function() {
    animateSidebar();
    return false;
});

function animateSidebar() {
    $("#sidebar").animate({
        width: "toggle"
    }, 350, function() {
        map.invalidateSize();
    });
}

function sizeLayerControl() {
    $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
    highlight.clearLayers();
}

function sidebarClick(id) {
    var layer = markerClusters.getLayer(id);
    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
    layer.fire("click");
    /* Hide sidebar and go to the map on small screens */
    if (document.body.clientWidth <= 767) {
        $("#sidebar").hide();
        map.invalidateSize();
    }
}



function syncSidebar() {

    /* Empty sidebar features */
    $("#feature-list tbody").empty();

    /* Loop through layer and add only features which are in the map bounds */
    academicLayer.eachLayer(function(layer) {



        /* Create side panel parent */
        const sidePanel = document.createElement('feature-title');

        /* Create side panel children */
        const spInterests = document.createElement('p');
        const spWebsite = document.createElement('a');
        const spPrograms = document.createElement('p');
        const spFirstName = document.createElement('p');
        const spLastName = document.createElement('p');
        const spUniversity = document.createElement('p');
        const spDescription = document.createElement('p');





        /* Set side panel children ids */
        spInterests.setAttribute("id", "side-interests");
        spWebsite.setAttribute("id", "side-website");
        spPrograms.setAttribute("id", "side-programs");
        spFirstName.setAttribute("id", "side-lastName");
        spLastName.setAttribute("id", "side-lastName");
        spUniversity.setAttribute("id", "side-university");
        spDescription.setAttribute("id", "side-university");


        /*Append secondary interests if there are ant*/
        if (layer.feature.properties.primary_field) {
            spInterests.textContent = layer.feature.properties.primary_field
        }

        if (layer.feature.properties.secondary_field) {
            spInterests.textContent = layer.feature.properties.primary_field +
                ', ' +
                layer.feature.properties.secondary_field
        }



        /*Create lab website link and text*/

        if (layer.feature.properties.website !== null) {

            aa = document.createTextNode('Click here for ' +
                layer.feature.properties.last_name +
                ' lab homepage');

            spWebsite.title = 'Click here for' +
                layer.feature.properties.last_name +
                ' lab homepage';

            aa.href = layer.feature.properties.website;
        }

        /*Check value then add programs*/
        if (layer.feature.properties.programs !== null) {
            if (layer.feature.properties.programs === 'null') {
                spPrograms.textContent = ''
            }
            if (layer.feature.properties.programs !== 'null') {
                spPrograms.textContent = layer.feature.properties.programs
            }
        }
        if (layer.feature.properties.programs === null) {
            spPrograms.textContent = ''
        }



        /* Display a modal when a marker is clicked */
        layer.on({
            click: function(e) {


                sidePanel.appendChild(spFirstName);
                sidePanel.appendChild(spLastName);
                sidePanel.appendChild(spUniversity);

                var td1 = document.getElementById('td1');
                var text = document.createTextNode("some text");
                td1.appendChild(text);



                $('#feature-title').html(
                    '<h3 id="modal-feature">' +
                    layer.feature.properties.first_name +
                    ' ' +
                    layer.feature.properties.last_name +
                    '</h3>' +
                    '<p id="click-modal-uni">' +
                    layer.feature.properties.uni +
                    '</p>');
                $("#feature-info").html(
                    '"><td style="vertical-align: middle;"></td>' +
                    '<td class="feature-name">' +
                    '<p id="click-modal-shortd">' +
                    layer.feature.properties.shortd +
                    '</p>' +
                    '<div>' +

                    '</div>' +
                    '<div>' +
                    '</div>' +
                    '</td></tr>');
                $("#featureModal").modal("show");
            }
        });

        /* Filter sidebar by the current map view */
        if (map.hasLayer(academicLayer)) {
            if (map.getBounds().contains(layer.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' +
                    L.stamp(layer) +
                    '" lat="' +
                    layer.getLatLng().lat +
                    '" lng="' +
                    layer.getLatLng().lng +
                    '"><td style="vertical-align: middle;"></td><td class="feature-name">' +
                    '<div class="side-pi-and-uni">' +
                    '<p id="side-pi">' +
                    layer.feature.properties.first_name +
                    ' ' +
                    layer.feature.properties.last_name +
                    '</p>' +
                    '<p id="side-uni">' +
                    layer.feature.properties.uni +
                    '</p>' +
                    '<p id="side-interests">' +
                    '</p>' +
                    '</div>' +
                    '<div class="side-dec">' +
                    '<p id="side-desc">' +
                    layer.feature.properties.shortd +
                    '</p>' +
                    '</div>' +
                    '<p>' +
                    '</p>' +
                    '<div>' +
                    '</div>'

                );
            }
        }
    });

    /* Update list.js featureList */
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });
}

/* Basemap Layers */
var usgsImagery = L.tileLayer("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 15,
    attribution: '&copy; Map services and data available from U.S. Geological Survey, National Geospatial Program. &copy'
});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
};

var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 10
});

var academicLayer = L.markerClusterGroup({})

var marker = null

function addPoints(data) {
    academicLayer.clearLayers()
    for (var row = 0; row < data.length; row++) {

        var marker = L.marker([data[row].latitude, data[row].longitude])

        const markerPopup = document.createElement('popup');
        const hoverName = document.createElement('h3');
        const hoverPrograms = document.createElement('p');
        const hoverUni = document.createElement('h4');
        const hoverInterests = document.createElement('p');

        hoverName.setAttribute("id", "hover-name");
        hoverName.textContent = data[row].first_name + ' ' + data[row].last_name;

        hoverUni.setAttribute("id", "hover-uni");
        hoverUni.textContent = data[row].university;

        if (data[row].primary_field) {
            hoverInterests.textContent = data[row].primary_field;
        }

        if (data[row].secondary_field) {
            hoverInterests.textContent = data[row].primary_field + ', ' + data[row].secondary_field
        }


        if (data[row].programs !== null) {
            if (data[row].programs === 'null') {
                hoverPrograms.textContent = ''
            }
            if (data[row].programs !== 'null') {
                hoverPrograms.textContent = data[row].programs
            }
        }
        if (data[row].programs === null) {
            hoverPrograms.textContent = ''
        }


        markerPopup.appendChild(hoverName);
        markerPopup.appendChild(hoverUni);
        markerPopup.appendChild(hoverInterests);
        markerPopup.appendChild(hoverPrograms);


        marker.bindPopup(markerPopup);

        marker.on('mouseover', function(e) {
            this.openPopup();
        });


        marker.on('mouseout', function(e) {
            this.closePopup();
        });

        marker.feature = {
            properties: {
                pi: data[row].principle_investigator,
                first_name: data[row].first_name,
                last_name: data[row].last_name,
                uni: data[row].university,
                image: data[row].display_image,
                shortd: data[row].short_description,
                website: data[row].website,
                primary_field: data[row].primary_field,
                secondary_field: data[row].secondary_field,
                programs: data[row].programs
            }
        };
        marker.addTo(academicLayer);
    }
}


/* Setup map view */
map = L.map("map", {
    zoom: 3,
    center: [48, -102],
    layers: [usgsImagery, markerClusters, highlight],
    zoomControl: false,
    attributionControl: false
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function(e) {
    syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
    highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
    $.each(map._layers, function(index, layer) {
        if (layer.getAttribution) {
            $("#attribution").html((layer.getAttribution()));
        }
    });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
    position: "bottomright"
});
attributionControl.onAdd = function(map) {
    var div = L.DomUtil.create("div", "leaflet-control-attribution");
    div.innerHTML = "<span class='hidden-xs'>Map services and data available from U.S. Geological Survey, National Geospatial Program | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Get the Code</a>";

    return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
} else {
    var isCollapsed = false;
}

/*var groupedOverlays = {
  // "Type": {
  "Academia": academicLayer
  // "Industry": industryLayer
  //}
};*/

/*var layerControl = L.control.groupedLayers(groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);*/

/* Highlight search box text on click */
$("#searchbox").click(function() {
    $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function(e) {
    if (e.which == 13) {
        e.preventDefault();
    }
});

$("#featureModal").on("hidden.bs.modal", function(e) {
    $(document).on("mouseout", ".feature-row", clearHighlight);
});


/* Run init on DOM load */
window.addEventListener('DOMContentLoaded', init);

/* Main function that controls map markers, etc. */
function init() {
    /* Retrieve JSON data */
    //  let requestURL = 'https://chasemc.github.io/temp2/j.json';
    let requestURL = 'data/gsheet.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        const gsheet = request.response['data'];
        academicLayer.addTo(map);
        addPoints(gsheet)

        $("#sel").on("change", function() {
            if ($('#sel').val().includes("All")) {
                addPoints(gsheet)
            } else {
                addPoints($.grep(gsheet, function(n, i) {
                    if (typeof n.secondary_field == "string") {
                        var secfield = n.secondary_field.split(',')
                    } else {
                        var secfield = [""]
                    }
                    return n.primary_field.concat(secfield).includes($('#sel').val());
                }))
            }
        })
        syncSidebar();

    }
}