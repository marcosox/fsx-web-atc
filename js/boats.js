var boatFields = [
    "id",
    "title",
    "latitude",
    "longitude",
    "altitude",
    "altAgl",
    "airspeed",
    "groundSpeed",
    "bank",
    "heading",
    "rudder",
    "throttle"
];

function boatStyle(resolution) {
    var icon = config.icons.boats.generic;
    var scale = 0.1;
    var title = this.get("title");
    if (title.toLowerCase().indexOf("veh_carrier") !== -1 ||
        title.toLowerCase().indexOf("nimitz") !== -1 ||
        title.toLowerCase().indexOf("eisenhower") !== -1 ||
        title.toLowerCase().indexOf("cvn69") !== -1 ||
        title.toLowerCase().indexOf("cvn68") !== -1) {
        icon = config.icons.boats.carrier;
        scale = 0.3;
    }
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            rotateWithView: true,
            scale: scale,
            rotation: (+this.get("heading") * Math.PI / 180),
            src: icon,
            crossOrigin: 'anonymous',
            color: styles.boats.iconColor
        })),
        text: config.showBoatLabels ? new ol.style.Text({
            text: this.get("id").toString(),
            font: 'bold 12px monospace',
            offsetX: 0,
            offsetY: -8,
            fill: new ol.style.Fill({
                color: styles.boats.labelColor
            })
        }) : undefined
    });
}

function requestBoats() {
    $.ajax({
        dataType: "json",
        url: config.backend.address + config.backend.url.boats,
        mimeType: "application/json",
        success: function (data, textStatus, jqXHR) {
            drawBoats(data);
        },
        error: ajaxErrorFunction
    });
}

function drawBoats(boatsList) {
    for (var i = 0; i < boatsList.length; i++) {
        var boat = boatsList[i];
        var id = boat['id'];
        var coordinates = ol.proj.fromLonLat(/** @type {ol.Coordinate}*/[boat['longitude'], boat['latitude']]);

        var feature = featureLayers.boats.getSource().getFeatureById(boat_id_prefix + id);

        if (feature === null) {
            // create feature
            feature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates)
                }
            );
            feature.setId(boat_id_prefix + id);
            updateFeatureProperties(feature, boat, boatFields);
            feature.setStyle(boatStyle);

            // add feature to correct layer
            featureLayers.boats.getSource().addFeature(feature);

        } else {
            // update feature
            feature.getGeometry().setCoordinates(coordinates);
            updateFeatureProperties(feature, boat, boatFields);
        }
    }

    // delete old boats
    var deleteArray = [];
    var layerFeatures = featureLayers.boats.getSource().getFeatures();
    for (i = 0; i < layerFeatures.length; i++) {    // for each feature in the layer
        feature = layerFeatures[i];
        id = feature.getId();
        var toBeDeleted = true;
        for (var j = 0; j < boatsList.length; j++) {    // search it in the boats list
            if ((boat_id_prefix + boatsList[j]['id']) === id) {
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
        id = feature.getId().substr(boat_id_prefix.length);
        console.log("removing deleted boat '" + feature.getId() + "'");
        featureLayers.boats.getSource().removeFeature(feature);
    }
}