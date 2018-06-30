// global constants
// feature id prefixes
var aircraft_id_prefix = "aircraft_";
var boat_id_prefix = "boat_";
var vehicle_id_prefix = "vehicle_";
var track_id_prefix = "track_";
// feature layers list
// order here defines layers z-index. Place them from lowest to highest
var featureLayers = {
    tracks: {
        name: "Aircraft tracks"
    }, airports: {
        name: "airports"
    }, NDB: {
        name: "NDB"
    }, VOR: {
        name: "VOR"
    }, waypoints: {
        name: "waypoints"
    }, boats: {
        name: "boats"
    }, vehicles: {
        name: "vehicles"
    }, groundAircrafts: {
        name: "Aircrafts (parked)"
    }, taxiAircrafts: {
        name: "Aircrafts (taxi)"
    }, aircrafts: {
        name: "Aircrafts (air)"
    }
};

// global variables
var map;
var mousePositionControl;
var refreshLoopID;
var errorCount = 0;
var errorCountThreshold = 10;

/**
 * Custom ol.Map control class for the config button
 * @type {{}}
 */
window.app = {};
app.OpenConfigControl = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = "settings";

    var this_ = this;

    function openConfigDialog() {
        $("#configDialog").dialog("open");
    }

    button.addEventListener('click', openConfigDialog, false);
    button.addEventListener('touchstart', openConfigDialog, false);

    var element = document.createElement('div');
    element.className = 'open-config-button ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};

/**
 * Persists the app config in local storage
 */
function saveConfig() {
    localStorage.setItem("fsx-web-atc.config", JSON.stringify(config));
    localStorage.setItem("fsx-web-atc.theme", JSON.stringify(styles));
}

/**
 * Retrieves the app config from local storage
 */
function loadConfig() {
    if (localStorage.getItem("fsx-web-atc.config") !== null) {
        config = JSON.parse(localStorage.getItem("fsx-web-atc.config"));
    }
    if (localStorage.getItem("fsx-web-atc.theme") !== null) {
        styles = JSON.parse(localStorage.getItem("fsx-web-atc.theme"));
    }
}

/**
 * Setups a spinner and links it to a config variable
 * @param id html element id
 * @param defaultValue default initial value
 * @param callback callback to run when value changes. Accepts one argument, the widget value.
 */
function setupSpinner(id, defaultValue, callback) {

    var spinner = $(id).spinner({
        stop: function (evt) {
            callback(parseInt(evt.target.value));
            saveConfig();
        }
    });
    spinner[0].value = defaultValue;
}

/**
 * Setups a checkbox and links it to a config variable
 * @param id html element id
 * @param defaultValue default initial value
 * @param callback callback to run when value changes. Accepts one argument, the widget value.
 */
function setupCheckbox(id, defaultValue, callback) {
    var checkbox = $(id);
    checkbox[0].checked = defaultValue;
    checkbox.click(function (evt) {
        callback(evt.target.checked);
        saveConfig();
    });
}

/**
 * Setups a text field and links it to a config variable
 * @param id html element id
 * @param defaultValue default initial value
 * @param callback callback to run when value changes. Accepts one argument, the widget value.
 */
function setupTextField(id, defaultValue, callback) {
    var textField = $(id);
    textField[0].value = defaultValue;
    textField.click(function (evt) {
        callback(evt.target.value);
        saveConfig();
    });
}

/**
 * Setups a color box and links it to a config variable
 * @param id html element id
 * @param defaultValue default initial value
 * @param callback callback to run when value changes. Accepts one argument, the widget value.
 */
function setupColorBox(id, defaultValue, callback) {
    var colorBox = $(id);
    colorBox[0].value = defaultValue;
    colorBox.change(function (evt) {
        callback(evt.target.value);
        saveConfig();
    });
}

/**
 * Setups a dropdown and links it to a config variable
 * @param id html element id
 * @param defaultValue default initial value
 * @param callback callback to run when value changes. Accepts one argument, the widget value.
 */
function setupSelectDropdown(id, defaultValue, callback) {
    var dropDown = $(id);
    dropDown[0].options.selectedIndex = dropDown.find("option[value=" + defaultValue + "]")[0].index;
    dropDown[0].onchange = function () {
        callback(this.options[this.options.selectedIndex].value);
        saveConfig();
    };
}

/**
 * Initialize the config dialog controls
 */
function setupConfigControls() {
    loadConfig();
    $('#config-tabs').tabs();
    setupTextField("#backendAddress", config.backend.address, function (val) {
        config.backend.address = val;
    });
    setupSpinner("#flightPathlength", styles.aircrafts.flightPathLength, function (val) {
        styles.aircrafts.flightPathLength = val;
    });
    setupCheckbox("#showBoatLabels", config.showBoatLabels, function (val) {
        config.showBoatLabels = val;
    });
    setupCheckbox("#showVehicleLabels", config.showVehicleLabels, function (val) {
        config.showVehicleLabels = val;
    });
    setupCheckbox("#followUserAircraft", config.followUserAircraft, function (val) {
        config.followUserAircraft = val;
    });
    setupColorBox("#aircraftColor", styles.aircrafts.iconColor, function (val) {
        styles.aircrafts.iconColor = val;
    });
    setupColorBox("#userAircraftColor", styles.aircrafts.userIconColor, function (val) {
        styles.aircrafts.userIconColor = val;
    });
    setupColorBox("#userAircraftLabelColor", styles.aircrafts.userLabelColor, function (val) {
        styles.aircrafts.userLabelColor = val;
    });
    setupColorBox("#aircraftLabelColor", styles.aircrafts.labelColor, function (val) {
        styles.aircrafts.labelColor = val;
    });
    setupColorBox("#boatColor", styles.boats.iconColor, function (val) {
        styles.boats.iconColor = val;
    });
    setupColorBox("#boatLabelColor", styles.boats.labelColor, function (val) {
        styles.boats.labelColor = val;
    });
    setupColorBox("#vehicleColor", styles.vehicles.iconColor, function (val) {
        styles.vehicles.iconColor = val;
    });
    setupColorBox("#vehicleLabelColor", styles.vehicles.labelColor, function (val) {
        styles.vehicles.labelColor = val;
    });
    setupColorBox("#flightPathColor", styles.aircrafts.flightPathColor, function (val) {
        styles.aircrafts.flightPathColor = val;
    });
    setupColorBox("#AirportsColor", styles.airports.iconColor, function (val) {
        styles.airports.iconColor = val;
    });
    setupColorBox("#AirportLabelColor", styles.airports.labelColor, function (val) {
        styles.airports.labelColor = val;
    });
    setupColorBox("#VORColor", styles.vor.iconColor, function (val) {
        styles.vor.iconColor = val;
    });
    setupColorBox("#VORLabelColor", styles.vor.labelColor, function (val) {
        styles.vor.labelColor = val;
    });
    setupColorBox("#NDBColor", styles.ndb.iconColor, function (val) {
        styles.ndb.iconColor = val;
    });
    setupColorBox("#NDBLabelColor", styles.ndb.labelColor, function (val) {
        styles.ndb.labelColor = val;
    });
    setupColorBox("#WaypointsColor", styles.waypoints.iconColor, function (val) {
        styles.waypoints.iconColor = val;
    });
    setupColorBox("#WaypointsLabelColor", styles.waypoints.labelColor, function (val) {
        styles.waypoints.labelColor = val;
    });
    setupSelectDropdown("#aircraft-label-type-selector", config.aircraftLabelsType, function (val) {
        config.aircraftLabelsType = val;
    });
    setupSelectDropdown("#ground-speed-display", config.groundSpeedFormat, function (val) {
        config.groundSpeedFormat = val;
    });
    setupSelectDropdown("#air-speed-display", config.airSpeedFormat, function (val) {
        config.airSpeedFormat = val;
    });
}

/**
 * Initializes the map and the rest of the app
 */
function initMap() {

    ol.inherits(app.OpenConfigControl, ol.control.Control);

    var baseTilesGroup = new ol.layer.Group({
        'title': 'Base layer',
        layers: []
    });
    var overlayGroup = new ol.layer.Group({
        'title': 'Overlays',
        layers: []
    });

    map = new ol.Map({
        layers: new ol.Collection([baseTilesGroup, overlayGroup]),
        interactions: ol.interaction.defaults({
            // constrainResolution: true,
            altShiftDragRotate: true,
            dragPan: true,
            rotate: true
        }),
        controls: ol.control.defaults().extend([new app.OpenConfigControl()]),
        target: 'ol-map',
        view: new ol.View({
            center: ol.proj.fromLonLat(config.initialPosition),
            // zoomFactor: 1.5,
            minZoom: 3,
            zoom: config.initialZoom
        })
    });

    // setup handler to save last position in local storage
    map.on("moveend", function savePosition(evt) {
        var coords = ol.proj.toLonLat(evt.map.getView().getCenter());
        var position = {
            lon: coords[0],
            lat: coords[1],
            zoom: evt.map.getView().getZoom()
        };
        localStorage.setItem("fsx-web-atc.lastPosition", JSON.stringify(position))
    });

    // setup tile layers
    baseTilesGroup.getLayers().push(new ol.layer.Tile({
            title: "OpenStreetMap",
            type: 'base',
            maxZoom: 19,
            source: new ol.source.OSM()
        })
    );
    for (var i = 0; i < tilesLayers.length; i++) {
        baseTilesGroup.getLayers().push(
            new ol.layer.Tile({
                type: 'base',
                title: tilesLayers[i].name,
                maxZoom: 21,
                source: new ol.source.OSM({
                    url: tilesLayers[i].url,
                    maxZoom: tilesLayers[i].maxZoom,
                    wrapX: true
                })
            })
        );
    }

    // setup overlay ground image layers

    // static images
    for (i = 0; i < imageOverlayLayers.length; i++) {
        var overlay = imageOverlayLayers[i];
        overlayGroup.getLayers().push(
            new ol.layer.Image({
                title: overlay.name,
                source: new ol.source.ImageStatic({
                    attributions: overlay.attribution,
                    url: 'charts/images/' + overlay.url,
                    projection: overlay.projection,
                    imageExtent: overlay.imageExtent
                })
            })
        )
    }

    // KML files
    for (i = 0; i < KMLOverlayLayers.length; i++) {
        var kmlFile = KMLOverlayLayers[i];
        overlayGroup.getLayers().push(
            new ol.layer.Vector({
                title: kmlFile.name,
                source: new ol.source.Vector({
                    url: 'charts/kml/' + kmlFile.url,
                    format: new ol.format.KML()
                })
            })
        )
    }

    // load feature layers from featureLayers
    var layersList = Object.keys(featureLayers);
    for (var k = 0; k < layersList.length; k++) {
        var key = layersList[k];
        featureLayers[key] = new ol.layer.Vector({
            title: featureLayers[key].name,
            source: new ol.source.Vector()
        });
        overlayGroup.getLayers().push(featureLayers[key]);
    }

    // setup map controls
    map.addControl(new ol.control.ScaleLine({
        units: 'nautical'
    }));
    map.addControl(new ol.control.ZoomToExtent({
        tipLabel: "Reset view",
        label: "R",
        extent: map.getView().calculateExtent()
    }));
    mousePositionControl = new ol.control.MousePosition({
        projection: new ol.proj.get("EPSG:4326"),
        coordinateFormat: coordinatesToDMSString
    });
    map.addControl(mousePositionControl);
    map.addControl(new ol.control.ZoomSlider());
    map.addControl(new ol.control.LayerSwitcher({
        target: 'ol-map',
        tipLabel: "Change base layer"
    }));

    // load configuration dialog
    $("#configDialog").load(
        "config.html",
        {},
        function () {
            setupConfigControls();
        }
    ).dialog({
        minWidth: 530,
        autoOpen: false
    });

    // load last position if found in local storage
    if (localStorage.getItem("fsx-web-atc.lastPosition") !== null) {
        var lastPosition = JSON.parse(localStorage.getItem("fsx-web-atc.lastPosition"));
        map.getView().setCenter(ol.proj.fromLonLat([lastPosition.lon, lastPosition.lat]));
        map.getView().setZoom(lastPosition.zoom);
    }

    // start the app
    startLoop();
}

/**
 * Logs an error in the lower status bar
 * @param jqXHR ajax request object
 * @param textStatus status text from ajax response callback
 * @param errorThrown error object thrown by the request
 */
function ajaxErrorFunction(jqXHR, textStatus, errorThrown) {
    console.error(jqXHR, textStatus, errorThrown);

    errorCount++;
    if (errorCount >= errorCountThreshold) {
        stopLoop();
        errorCount = 0;
    }
    switch (textStatus) {
        case "error" : {
            $("#status").text("Error connecting to FSX-saas server - status: " + textStatus + " - response: " + (jqXHR.responseText !== undefined ? jqXHR.responseText : ""));
            break;
        }
        case("timeout"): {
            $("#status").text("Can't connect to FSX-saas server - connection timeout");
            break;
        }
    }
}

/**
 * Returns the specified coordinates as a degrees, minutes, seconds string.
 * Note that this returns coordinates as lat, lon unlike the others
 * @param {number[]} coord coordinates (decimal [lon, lat])
 * @returns {string} output string
 */
function coordinatesToDMSString(coord) {
    var lonD = 0 | coord[0];
    var lonM = Math.round(Math.abs(coord[0]) % 1 * 60);
    var lonS = /*Math.round*/(Math.abs(coord[0]) * 60 % 1 * 60);
    var latD = 0 | coord[1];
    var latM = Math.round(Math.abs(coord[1]) % 1 * 60);
    var latS = /*Math.round*/(Math.abs(coord[1]) * 60 % 1 * 60);
    return (coord[1] < 0 && coord[1] > -1 ? "-" : "")
        + latD + "° "
        + (latM < 10 ? "0" : "") + latM + "' "	// zero padding
        + (latS < 10 ? "0" : "") + latS.toFixed(2) + "\", "	// zero padding
        + (coord[0] < 0 && coord[0] > -1 ? "-" : " ")
        + lonD + "° "
        + (lonM < 10 ? "0" : "") + lonM + "' "	// zero padding
        + (lonS < 10 ? "0" : "") + lonS.toFixed(2) + "\"";	// zero padding
}

/**
 * Stop the requests loop
 */
function stopLoop() {
    window.clearInterval(refreshLoopID);
    $("#status").text("Requests to fsx-saas server stopped.")
}

/**
 * Start the requests loop
 */
function startLoop() {
    // one shot requests
    requestAirports();
    requestVORs();
    requestNDBs();
    requestWaypoints();
    // periodic requests
    refreshLoopID = window.setInterval(requestLoop, config.refreshRate);
    $("#status").text("Requests to fsx-saas server started.")
}

/**
 * Main request loop
 */
function requestLoop() {
    requestAircrafts();
    requestBoats();
    requestVehicles();
}

/**
 * Manually fire all the requests
 */
function refreshView() {
    requestAirports();
    requestVORs();
    requestNDBs();
    requestWaypoints();
    requestAircrafts();
    requestBoats();
    requestVehicles();
}

/**
 * Taken from: https://stackoverflow.com/questions/31297721/how-to-get-a-layer-from-a-feature-in-openlayers-3
 * This is a workaround.
 * Returns the associated layer.
 * @param {ol.Map} map.
 * @return {ol.layer.Vector} Layer.
 */
ol.Feature.prototype.getLayer = function (map) {
    var this_ = this, layer_ = undefined, layersToLookFor = [];
    /**
     * Populates array layersToLookFor with only
     * layers that have features
     */
    var check = function (layer) {
        var source = layer.getSource();
        if (source instanceof ol.source.Vector) {
            var features = source.getFeatures();
            if (features.length > 0) {
                layersToLookFor.push({
                    layer: layer,
                    features: features
                });
            }
        }
    };
    //loop through map layers
    map.getLayers().forEach(function (layer) {
        if (layer instanceof ol.layer.Group) {
            layer.getLayers().forEach(check);
        } else {
            check(layer);
        }
    });
    layersToLookFor.forEach(function (obj) {
        var found = obj.features.some(function (feature) {
            return this_ === feature;
        });
        if (found) {
            //this is the layer we want
            layer_ = obj.layer;
        }
    });
    return layer_;
};