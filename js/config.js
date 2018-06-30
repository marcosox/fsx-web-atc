/**
 * Tile server layers
 */
var tilesLayers = [
    {
        name: "World Imagery",  // name shown in layer switcher
        url: "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        maxZoom: 21     // maximum zoom level
    }, {
        name: "World navigation chart",
        url: 'http://services.arcgisonline.com/arcgis/rest/services/Specialty/World_Navigation_Charts/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 10
    }, {
        name: "Dark Matter (labels)",
        url: 'http://{a-f}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        maxZoom: 21
    }, {
        name: "Dark Matter (no labels)",
        url: 'http://{a-f}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        maxZoom: 21
    }, {
        name: "World dark",
        url: 'https://{a-d}.tiles.mapbox.com/v3/mapbox.world-dark/{z}/{x}/{y}.png',
        maxZoom: 11
    }, {
        name: "Stamen toner",
        url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png',
        maxZoom: 21
    }, {
        name: "Stamen terrain",
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.png',
        maxZoom: 21
    }, {
        name: "Control room",
        url: 'https://{a-d}.tiles.mapbox.com/v3/mapbox.control-room/{z}/{x}/{y}.png',
        maxZoom: 8
    }, {
        name: "Light Gray",
        url: "http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        maxZoom: 16
    }, {
        name: "Dark gray",
        url: 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 16
    }
];

/**
 * Chart image overlays
 */
var imageOverlayLayers = [
    {
        name: "LIRF AD chart",  // name shown in layer switcher
        attribution: "AIP 2017",    // attribution text
        url: "LIRF/LIRF.png",   // url, relative to img/charts/
        projection: "UTM",  // projection, UTM is meters
        imageExtent: [1359250, 5127500, 1368650, 5139180]   // image bounding box in meters from 0,0
    }
];

/**
 * KML overlays
 */
var KMLOverlayLayers = [
    {
        name: "LIRF distance rings (kml) - 5 and 10 nm",
        url: "LIRF/Distance_rings.kml"
    }
];

/**
 * App configuration
 */
var config = {
    refreshRate: 1000,	// in ms
    initialPosition: [0.0, 0.0],
    initialZoom: 3,
    groundSpeedFormat: "groundspeed",
    airSpeedFormat: "airspeed",
    aircraftLabelsType: "complete",
    followUserAircraft: true,
    showVehicleLabels: false,
    showBoatLabels: false,
    icons: {
        aircrafts: {
            generic: "img/aircrafts/generic.png"
        },
        boats: {
            generic: "img/boats/boat.png",
            carrier: "img/boats/carrier.png"
        },
        vehicles: {
            generic: "img/vehicles/truck.png"
        },
        airports: "img/square.png",
        vor: "img/vor.png",
        ndb: "img/ndb.png",
        waypoints: "img/waypoint.png"
    },
    backend: {
        address: "http://127.0.0.1:8080",
        url: {
            aircrafts: "/aircrafts",
            vehicles: "/vehicles",
            boats: "/boats",
            airports: "/airports",
            vors: "/vors",
            ndbs: "/ndbs",
            waypoints: "/waypoints"
        }
    }
};

var styles = {
    aircrafts: {
        iconColor: "#FFFFFF",
        userIconColor: '#FF7F00',
        labelColor: "#00FF00",
        userLabelColor: "#FF7F00",
        flightPathColor: "#008000",
        flightPathLength: 9999,
        flightPathWidth: 1
    },
    vehicles: {
        iconColor: "#77240c",
        labelColor: "#9aaa9a"
        // flightPathColor: "#00FF00",  //  TODO: add back
        // flightPathLength: 9999,
        // flightPathWidth: 1
    },
    boats: {
        iconColor: "#0000FF",
        labelColor: "#5050FF"
        // flightPathColor: "#00FF00",  // TODO: add back
        // flightPathLength: 9999,
        // flightPathWidth: 1
    },
    airports: {
        iconColor: "#0000FF",
        labelColor: "#3383ff"
    },
    vor: {
        iconColor: "#00FF00",
        labelColor: "#00FFFF"
    },
    ndb: {
        iconColor: "#0000FF",
        labelColor: "#00FFFF"
    },
    waypoints: {
        iconColor: "#0000FF",
        labelColor: "#00FFFF"
    }
};
