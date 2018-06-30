var aircraftFields = [
    "id",
    "title",
    "atcType",
    "atcModel",
    "atcID",
    "atcAirline",
    "atcFlightNumber",
    "atcHeavy",
    "ifr",
    "atcState",
    "from",
    "to",
    "latitude",
    "longitude",
    "altitude",
    "altAgl",
    "onGround",
    "airspeed",
    "groundSpeed",
    "verticalSpeed",
    "pitch",
    "bank",
    "heading",
    "aileron",
    "elevator",
    "rudder",
    "throttle",
    "transponder",
    "windSpeed",
    "windDirection",
    "visibility",
    "ambientTemperature",
    "ambientPressure",
    "barometerPressure"
];

function randomPlacement() {
    var placements = ["left", "right", "center"];
    return placements[Math.floor(Math.random() * 2.99)]
}

function aircraftStyle(resolution) {

    var flightLevel = Math.floor(this.get("altitude") / 100);
    if (flightLevel < 10) {
        flightLevel = "00" + flightLevel;
    } else if (flightLevel < 100) {
        flightLevel = "0" + flightLevel;
    }
    var label = this.get("atcAirline") + " " + this.get("atcFlightNumber") + "\n";
    if (config.aircraftLabelsType === "complete") {
        label += this.get("from") + "-" + this.get("to") + "\n"
            + flightLevel + " ";
        // add speed in correct format
        var featureLayer = this.getLayer(map);
        if (featureLayer === featureLayers.aircrafts) {
            // in air
            if (config.airSpeedFormat === "groundspeed") {
                label += Math.floor(this.get("groundSpeed"));
            } else if (config.airSpeedFormat === "airspeed") {
                label += Math.floor(this.get("airspeed"));
            }
        } else {
            // on ground
            if (config.groundSpeedFormat === "groundspeed") {
                label += Math.floor(this.get("groundSpeed"));
            } else if (config.groundSpeedFormat === "airspeed") {
                label += Math.floor(this.get("airspeed"));
            }
        }
    }
    var verticalOffset = ((config.aircraftLabelsType === "complete") ? -32 : -8);
    if (this.get("labelPlacementY") > 0.5) {
        verticalOffset = ((config.aircraftLabelsType === "complete") ? 32 : 16);
    }
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            rotateWithView: true,
            scale: 0.25,
            rotation: (+this.get("heading") * Math.PI / 180),
            src: config.icons.aircrafts.generic,
            crossOrigin: 'anonymous',
            color: this.getId() === aircraft_id_prefix + "0" ? styles.aircrafts.userIconColor : styles.aircrafts.iconColor
        })),
        text: config.aircraftLabelsType !== "none" ? new ol.style.Text({
            text: label,
            font: 'bold 12px monospace',
            textAlign: this.get("labelPlacementX"),
            offsetX: 0,
            offsetY: verticalOffset,
            fill: new ol.style.Fill({
                color: this.getId() === 0 ? styles.aircrafts.userLabelColor : styles.aircrafts.labelColor
            })
        }) : undefined
    });
}

function trackStyle() {
    return (featureLayers.tracks.getVisible() ? new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: styles.aircrafts.flightPathColor,
            width: styles.aircrafts.flightPathWidth
        }),
        fill: new ol.style.Fill({
            color: styles.aircrafts.flightPathColor
        })
    }) : undefined);
}

function requestAircrafts() {
    $.ajax({
        dataType: "json",
        url: config.backend.address + config.backend.url.aircrafts,
        mimeType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#status").text("Current aircrafts displayed: " + data.length);
            drawAircrafts(data);
        },
        error: ajaxErrorFunction
    });
}

function calculateAircraftLayer(feature) {
    var layer;
    var state = feature['atcState'];
    if (state === "init" ||
        state === "sleep" ||
        state === "flt plan" ||
        state === "startup" ||
        state === "preflight support" ||
        state === "clearance" ||
        state === "pre taxi out" ||
        state === "shutdown" ||
        state === "postflight support"
    ) {
        layer = featureLayers.groundAircrafts;
    } else if (
        state === "push back 1" ||
        state === "push back 2" ||
        state === "taxi out" ||
        state === "rollout" ||
        state === "taxi in") {
        layer = featureLayers.taxiAircrafts;
    } else {
        layer = featureLayers.aircrafts;
    }
    return layer;
}

/**
 * moves aircraft and track features from one layer to another based on calculateAircraftLayer()
 * @param feature aircraft feature
 */
function changeAircraftLayer(feature) {
    var layer = calculateAircraftLayer(feature.getProperties());
    var currentLayer = feature.getLayer(map);
    if (currentLayer !== layer) {
        console.log("changing aircraft ", feature.getId(), " layer from ", currentLayer.get('title'), " to ", layer.get('title'));
        currentLayer.getSource().removeFeature(feature);
        var id = feature.getId().substr(aircraft_id_prefix.length);
        var track = currentLayer.getSource().getFeatureById(track_id_prefix + id);
        currentLayer.getSource().removeFeature(track);
        layer.getSource().addFeature(feature);
        layer.getSource().addFeature(track);
    }
}

/**
 * sets all the feature properties based on the aircraft fields
 * @param feature openlayers feature object
 * @param data data item with fresh values
 * @param fields array of fields names to update
 */
function updateFeatureProperties(feature, data, fields) {
    for (var i = 0; i < fields.length; i++) {
        feature.set(fields[i], data[fields[i]]);
    }
}

function observeAircraft(event) {
    if (event.key === "atcState") {
        changeAircraftLayer(event.target);
    }
}

/**
 * searches for an aircraft and the corresponding track
 * @param id
 * @returns {aircraft: ol.Feature | *, track: ol.Feature }
 */
function searchAircraftAndTrackById(id) {
    var feature;
    var aircraftLayers = [featureLayers.aircrafts, featureLayers.taxiAircrafts, featureLayers.groundAircrafts];
    for (var i = 0; i < aircraftLayers.length; i++) {
        feature = aircraftLayers[i].getSource().getFeatureById(aircraft_id_prefix + id);
        var track = aircraftLayers[i].getSource().getFeatureById(track_id_prefix + id);
        if (feature !== null) {
            if (track === null) {
                console.warn("track is null for object", feature.getId());
            }
            return {
                aircraft: feature,
                track: track
            };
        }
    }
    return {
        aircraft: null,
        track: null
    };
}

function drawAircrafts(aircraftsList) {
    for (var i = 0; i < aircraftsList.length; i++) {
        var aircraft = aircraftsList[i];
        var id = aircraft['id'];
        var coordinates = ol.proj.fromLonLat(/** @type {ol.Coordinate}*/[aircraft['longitude'], aircraft['latitude']]);

        if (config.followUserAircraft === true && id === 0) {
            map.getView().setCenter(coordinates);
        }
        var aircraftAndTrack = searchAircraftAndTrackById(id);
        var feature = aircraftAndTrack.aircraft;
        var track = aircraftAndTrack.track;

        if (feature === null) {
            // create feature
            feature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates)
                }
            );
            feature.setId(aircraft_id_prefix + id);
            updateFeatureProperties(feature, aircraft, aircraftFields);
            feature.set("labelPlacementX", randomPlacement());
            feature.set("labelPlacementY", Math.random());
            feature.setStyle(aircraftStyle);

            // add feature to correct layer
            var layer = calculateAircraftLayer(aircraft);
            layer.getSource().addFeature(feature);

            // create track
            track = new ol.Feature({
                geometry: new ol.geom.LineString([coordinates, coordinates])	// questo viene disegnato bene
            });
            track.setId(track_id_prefix + id);
            track.setStyle(trackStyle);
            feature.getLayer(map).getSource().addFeature(track);

            // set listener last, so we have the track in the same layer
            feature.on("propertychange", observeAircraft);
        } else {
            // update feature
            feature.getGeometry().setCoordinates(coordinates);
            updateFeatureProperties(feature, aircraft, aircraftFields);

            // update track
            var pathCoords = track.getGeometry().clone().getCoordinates();
            var lastPoint = pathCoords[pathCoords.length - 1];
            if (lastPoint[0] !== coordinates[0] || lastPoint[1] !== coordinates[1]) {
                (/** @type {ol.geom.LineString}*/track.getGeometry()).appendCoordinate(coordinates);
            }

            // length limit the linestring
            pathCoords = track.getGeometry().clone().getCoordinates();
            if (styles.aircrafts.flightPathLength >= 0 && pathCoords.length > styles.aircrafts.flightPathLength) {
                while (pathCoords.length > styles.aircrafts.flightPathLength) {
                    pathCoords.shift();
                }
                track.getGeometry().setCoordinates(pathCoords);
            }
        }
    }

    // delete old aircrafts
    var aircraftLayers = [featureLayers.aircrafts, featureLayers.taxiAircrafts, featureLayers.groundAircrafts];
    for (var k = 0; k < aircraftLayers.length; k++) {   // for each aircraft layer
        var deleteArray = [];
        var layerFeatures = aircraftLayers[k].getSource().getFeatures();
        for (i = 0; i < layerFeatures.length; i++) {    // for each feature in the layer
            feature = layerFeatures[i];
            id = feature.getId();
            if (feature.getId().indexOf(track_id_prefix) !== 0) { // if not a track...
                var toBeDeleted = true;
                for (var j = 0; j < aircraftsList.length; j++) {    // search it in the aircrafts list
                    if ((aircraft_id_prefix + aircraftsList[j]['id']) === id) {
                        toBeDeleted = false;
                        break;
                    }
                }
                if (toBeDeleted === true) {
                    deleteArray.push(feature);
                }
            }
        }
        for (i = 0; i < deleteArray.length; i++) {
            feature = deleteArray[i];
            id = feature.getId().substr(aircraft_id_prefix.length);
            console.log("removing deleted aircraft '" + feature.getId() + "'");
            aircraftLayers[k].getSource().removeFeature(feature);
            var trackToBeDeleted = aircraftLayers[k].getSource().getFeatureById(track_id_prefix + id);
            aircraftLayers[k].getSource().removeFeature(trackToBeDeleted);
        }
    }
}