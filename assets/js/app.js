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
     
      if (layer.feature.properties.primary_field) {
      var interests = layer.feature.properties.primary_field
    }

    if (layer.feature.properties.secondary_field) {
      var interests = layer.feature.properties.primary_field + ', ' + layer.feature.properties.secondary_field
    }

    if (layer.feature.properties.website !== null) {
      var weblink = '<a id="side-website"; href="' +
        layer.feature.properties.website +
        '" target="_blank">' +
        'Click here for ' +
        layer.feature.properties.last_name +
        ' lab homepage' +
        '</a>'
    }
    if (layer.feature.properties.website === null) {
            console.log('hsdhdhdhd')

      var weblink = ''
    }
 
    if (layer.feature.properties.programs !== null) {
     if (layer.feature.properties.programs === 'null') {
      var program_list = ''
    }
     if (layer.feature.properties.programs !== 'null') {
     var program_list = '<p id="click-modal-programs">' +
          layer.feature.properties.programs +
          '</p>' 
    }
  }
        if (layer.feature.properties.programs === null) {
      var program_list = ''
    }


    layer.on({
      click: function(e) {
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
          program_list +
          '</div>' +
          '<div>' +
          weblink +
          '</div>' +
          '</td></tr>');
        $("#featureModal").modal("show");
      }
    });

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
          interests +
          '</p>' +
          '</div>' +
          '<div class="side-dec">' +
          '<p id="side-desc">' +
          layer.feature.properties.shortd +
          '</p>' +
          '</div>' +
          '<p>' +
          program_list +
          '</p>' +
          '<div>' +
          weblink +
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

    var popup = data[row].principle_investigator;
    var marker = L.marker([data[row].latitude, data[row].longitude])

    if (data[row].primary_field) {
      var interests = data[row].primary_field
    }

    if (data[row].secondary_field) {
      var interests = data[row].primary_field + ', ' + data[row].secondary_field
    }

    if (data[row].programs !== null) {
     if (data[row].programs === 'null') {
      var program_list = ''
    }
     if (data[row].programs !== 'null') {
     var program_list = '<p id="click-modal-programs">' +
          data[row].programs +
          '</p>' 
    }
  }
        if (data[row].programs === null) {
      var program_list = ''
    }

    marker.bindPopup('<h3 id="hover-name">' +
      '<u>' +
      data[row].first_name +
      ' ' +
      data[row].last_name +
      '</u>' +
      '</h3>' +
      '<h4 id="hover-uni">' +
      //+ 'University: ' 
      data[row].university +
      '</h4>' +
      '<p>' +
      interests +
      '</p>' +
      '<p>' +
      program_list +
      '</p>' +
      '<div id=popup-click>' +
      'Click map-marker more info' +
      '</div>', {
        autoPan: false
      });

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

function init() {
  academicLayer.addTo(map);
  addPoints(gsheet)
  $("#sel").on("change", function() {
    if ($('#sel').val() == "All") {
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
    syncSidebar();
  })
}

window.addEventListener('DOMContentLoaded', init);
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



//  set drop down menu automatically (currently whitelisted in index.html)
// $(function() {

//   var lookup = {};
//   var items = gsheet;
//   var result = [];

//   for (var item, i = 0; item = items[i++];) {
//     var name = item.primary_field;

//     if (!(name in lookup)) {
//       lookup[name] = 1;
//       result.push(name);
//     }
//   }

//   result.sort()
//   result.unshift("All")

//   $.each(result, function(i, option) {
//     $('#sel').append($('<option/>').attr("value", option).text(option));
//   })
// })

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
    .disableClickPropagation(container)
    .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
