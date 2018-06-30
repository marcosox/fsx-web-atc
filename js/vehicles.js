var vehicleFields = [
    "id",
    "title",
    "atcState",
    "latitude",
    "longitude",
    "groundSpeed",
    "heading",
    "rudder",
    "throttle",
    "windSpeed",
    "windDirection",
    "visibility",
    "ambientTemperature",
    "ambientPressure",
    "barometerPressure"
];

function vehicleStyle(resolution) {
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            rotateWithView: true,
            scale: 0.1,
            rotation: (+this.get("heading") * Math.PI / 180),
            src: config.icons.vehicles.generic,
            crossOrigin: 'anonymous',
            color: styles.vehicles.iconColor
        })),
        text: config.showVehicleLabels ? new ol.style.Text({
            text: this.get("id").toString(),
            font: 'bold 12px monospace',
            offsetX: 0,
            offsetY: -8,
            fill: new ol.style.Fill({
                color: styles.vehicles.labelColor
            })
        }) : undefined
    });
}

function requestVehicles() {
    $.ajax({
        dataType: "json",
        url: config.backend.address + config.backend.url.vehicles,
        mimeType: "application/json",
        success: function (data, textStatus, jqXHR) {
            drawVehicles(data);
        },
        error: ajaxErrorFunction
    });
}

function drawVehicles(vehiclesList) {
    for (var i = 0; i < vehiclesList.length; i++) {
        var vehicle = vehiclesList[i];
        var id = vehicle['id'];
        var coordinates = ol.proj.fromLonLat(/** @type {ol.Coordinate}*/[vehicle['longitude'], vehicle['latitude']]);

        var feature = featureLayers.vehicles.getSource().getFeatureById(vehicle_id_prefix + id);

        if (feature === null) {
            // create feature
            feature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates)
                }
            );
            feature.setId(vehicle_id_prefix + id);
            updateFeatureProperties(feature, vehicle, vehicleFields);
            feature.setStyle(vehicleStyle);

            // add feature to correct layer
            featureLayers.vehicles.getSource().addFeature(feature);

        } else {
            // update feature
            feature.getGeometry().setCoordinates(coordinates);
            updateFeatureProperties(feature, vehicle, vehicleFields);
        }
    }

    // delete old vehicles
    var deleteArray = [];
    var layerFeatures = featureLayers.vehicles.getSource().getFeatures();
    for (i = 0; i < layerFeatures.length; i++) {    // for each feature in the layer
        feature = layerFeatures[i];
        id = feature.getId();
        var toBeDeleted = true;
        for (var j = 0; j < vehiclesList.length; j++) {    // search it in the vehicles list
            if ((vehicle_id_prefix + vehiclesList[j]['id']) === id) {
                toBeDeleted = false;
                break;
            }
        }
        if (toBeDeleted === true) {
            deleteArray.push(feature);
        }
    }
    for (i = 0; i < deleteArray.length; i++) {
        feature = deleteArray[i];
        id = feature.getId().substr(vehicle_id_prefix.length);
        console.log("removing deleted vehicle '" + feature.getId() + "'");
        featureLayers.vehicles.getSource().removeFeature(feature);
    }
}