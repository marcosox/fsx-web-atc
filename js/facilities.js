function airportsStyle(resolution) {
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.2,
            src: config.icons.airports,
            crossOrigin: 'anonymous',
            color: styles.airports.iconColor
        })),
        text: new ol.style.Text({
            text: this.get("icao"),
            offsetX: 0,
            offsetY: 12,
            fill: new ol.style.Fill({
                color: styles.airports.labelColor
            })
        })
    });
}

function vorStyle(resolution) {
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.2,
            src: config.icons.vor,
            crossOrigin: 'anonymous',
            color: styles.vor.iconColor
        })),
        text: new ol.style.Text({
            text: this.get("icao"),
            offsetX: 0,
            offsetY: 12,
            fill: new ol.style.Fill({
                color: styles.vor.labelColor
            })
        })
    });
}

function ndbStyle(resolution) {
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.2,
            src: config.icons.ndb,
            crossOrigin: 'anonymous',
            color: styles.ndb.iconColor
        })),
        text: new ol.style.Text({
            text: this.get("icao"),
            offsetX: 0,
            offsetY: 12,
            fill: new ol.style.Fill({
                color: styles.ndb.labelColor
            })
        })
    });
}

function waypointStyle(resolution) {
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.2,
            src: config.icons.waypoints,
            crossOrigin: 'anonymous',
            color: styles.waypoints.iconColor
        })),
        text: new ol.style.Text({
            text: this.get("icao"),
            offsetX: 0,
            offsetY: 12,
            fill: new ol.style.Fill({
                color: styles.waypoints.labelColor
            })
        })
    });
}

function requestAirports() {
    $.ajax({
        dataType: "json",
        url: config.backend.address + config.backend.url.airports,
        mimeType: "application/json",
        success: function (data, textStatus, jqXHR) {
            drawAirports(data);
        },
        error: ajaxErrorFunction
    });
}

function requestVORs() {
    $.ajax({
        dataType: "json",
        url: config.backend.address + config.backend.url.vors,
        mimeType: "application/json",
        success: function (data, textStatus, jqXHR) {
            drawVORs(data);
        },
        error: ajaxErrorFunction
    });
}

function requestNDBs() {
    $.ajax({
        dataType: "json",
        url: config.backend.address + config.backend.url.ndbs,
        mimeType: "application/json",
        success: function (data, textStatus, jqXHR) {
            drawNDBs(data);
        },
        error: ajaxErrorFunction
    });
}

function requestWaypoints() {
    $.ajax({
        dataType: "json",
        url: config.backend.address + config.backend.url.waypoints,
        mimeType: "application/json",
        success: function (data, textStatus, jqXHR) {
            drawWaypoints(data);
        },
        error: ajaxErrorFunction
    });
}

function drawAirports(airportsList) {
    for (var i = 0; i < airportsList.length; i++) {
        var airport = airportsList[i];
        var coordinates = ol.proj.fromLonLat(/** @type {ol.Coordinate}*/[airport['longitude'], airport['latitude']]);
        var feature = featureLayers.airports.getSource().getFeatureById("airport_" + airport['icao']);
        if (feature !== null) {
            feature.getGeometry().setCoordinates(coordinates);
        } else {
            feature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                type: "airport",
                icao: airport['icao'],
                alt: airport['altitude']
            });
            feature.setId("airport_" + airport['icao']);
            feature.setStyle(airportsStyle);
            featureLayers.airports.getSource().addFeature(feature);
        }
    }
}

function drawVORs(VORList) {
    for (var i = 0; i < VORList.length; i++) {
        var vor = VORList[i];
        var coordinates = ol.proj.fromLonLat(/** @type {ol.Coordinate}*/[vor['longitude'], vor['latitude']]);
        var feature = featureLayers.VOR.getSource().getFeatureById("vor_" + vor['icao']);
        if (feature !== null) {
            feature.getGeometry().setCoordinates(coordinates);
        } else {
            feature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                type: "VOR",
                icao: vor['icao'],
                alt: vor['altitude']
            });
            feature.setId("vor_" + vor['icao']);
            feature.setStyle(vorStyle);
            featureLayers.VOR.getSource().addFeature(feature);
        }
    }
}

function drawNDBs(NDBList) {
    for (var i = 0; i < NDBList.length; i++) {
        var ndb = NDBList[i];
        var coordinates = ol.proj.fromLonLat(/** @type {ol.Coordinate}*/[ndb['longitude'], ndb['latitude']]);
        var feature = featureLayers.NDB.getSource().getFeatureById("ndb_" + ndb['icao']);
        if (feature !== null) {
            feature.getGeometry().setCoordinates(coordinates);
        } else {
            feature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                type: "NDB",
                icao: ndb['icao'],
                alt: ndb['altitude']
            });
            feature.setId("ndb_" + ndb['icao']);
            feature.setStyle(ndbStyle);
            featureLayers.NDB.getSource().addFeature(feature);
        }
    }
}

function drawWaypoints(waypointsList) {
    for (var i = 0; i < waypointsList.length; i++) {
        var waypoint = waypointsList[i];
        var coordinates = ol.proj.fromLonLat(/** @type {ol.Coordinate}*/[waypoint['longitude'], waypoint['latitude']]);
        var feature = featureLayers.waypoints.getSource().getFeatureById("waypoint_" + waypoint['icao']);
        if (feature !== null) {
            feature.getGeometry().setCoordinates(coordinates);
        } else {
            feature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                type: "waypoint",
                icao: waypoint['icao'],
                alt: waypoint['altitude']
            });
            feature.setId("waypoint" + waypoint['icao']);
            feature.setStyle(waypointStyle);
            featureLayers.waypoints.getSource().addFeature(feature);
        }
    }
}
