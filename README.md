# FSX web ATC #

Interactive web map for FSX. Shows navigation aids, air and ground traffic.
Data is taken from [fsx-saas](https://github.com/marcosox/fsx-saas), an HTTP server that exposes FSX simconnect data.

![alt text][screenshot-main]

[screenshot-main]: screenshots/5-air.png "Typical setup for a radar ATC position"

## Installation  

In order to use fsx-web-atc you will need [fsx-saas](https://marcosox.github.io/fsx-saas/) connected to a running FSX 
(check the simconnect notes of fsx-saas for more informations on how to connect to remote FSX instances)

## fsx-web-atc installation
To install fsx-web-atc, download the repository tree into a folder and
serve it from your favourite webserver (e.g. apache).  
No configuration is required if fsx-saas is running on the same host,
 otherwise you can change its address in the config dialog. 

## Usage
The main interface of fsx-web-atc is a world map that shows air, ground and water traffic.

![alt text][screenshot-map]

[screenshot-map]: screenshots/1-main.png "main map"

In the upper right corner, there's the layer selector, where the base map layer and the included overlays can be chosen.

![alt text][screenshot-switcher]

[screenshot-switcher]: screenshots/2-switcher.png "The layer switcher can be used to change what's shown on the map"

In the lower left corner, there's the option panel.

![alt text][screenshot-config]

[screenshot-config]: screenshots/4-config.png "The config dialog"

By changing the layers the view can be adapted for a ground view or an approach/departure position:

![alt text][screenshot-ground]

[screenshot-ground]: screenshots/3-ground.png "A ground position setup"

### Additional layers
Additional overlays can be made available in kml or image format. To add an overlay:
#### KML
1. Place your kml file in a new folder under `charts/kml/`
2. Extend the `KMLOverlayLayers` array in `config.js` by adding a new block:

        var KMLOverlayLayers = [
            {
                name: "LIRF distance rings (kml) - 5 and 10 nm",
                url: "LIRF/Distance_rings.kml"
            }, {
                name: "My new layer: KJFK chart",   // <---- name shown in layer switcher
                url: "KJFK/Ground_chart.kml"    // <---- path to kml file relative to /charts/kml
            }
        ];
        
#### Static images
1. Place your image (any browser supported format should go) in a new folder under `charts/images/`
2. Extend the `imageOverlayLayers` array in `config.js` by adding a new block:

        var imageOverlayLayers = [
            {
                    name: "LIRF AD chart",
                    attribution: "AIP 2017",
                    url: "LIRF/LIRF.png",
                    projection: "UTM",
                    imageExtent: [1359250, 5127500, 1368650, 5139180]
                }, {
                    name: "KJFK AD chart",  // <---- name shown in layer switcher
                    attribution: "marcosox",    // <---- attribution text
                    url: "KJFK/KJFK Ground chart.png",   // <---- url, relative to img/charts/
                    projection: "UTM",  // <---- projection, UTM is meters
                    imageExtent: [1346260, 5101530, 1355720, 5108987]    // <---- this is with correct width:height ratio, best alignment on upper right corner
                }
        ];

## Feedback and contacts
If you think there is a bug, or something is missing or wrong with the documentation/support files, feel free to [open an issue].

## License
This software is released under the LGPL V3 license.
A copy is included in the LICENSE file


[open an issue]: https://github.com/marcosox/fsx-web-atc/issues
[releases page]: https://github.com/marcosox/fsx-web-atc/releases