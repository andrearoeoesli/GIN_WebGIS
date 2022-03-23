


//Instanziierung Vector Source mit einer WFS GetFeature Abfrage
var vectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: function (extent) {
        return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
            'version=1.1.0&request=GetFeature&typename=Pfadi_Lagerplatz:Vektor_Flaeche&' +
            'outputFormat=application/json';
    },
    strategy: ol.loadingstrategy.bbox
});

//Instanziierung Vector Layers mit einer Source und Darstellung
var vector = new ol.layer.Vector({
    source: vectorSource,
    fill: new ol.style.Fill({
        color: 'green'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 1
      })
});

var source = new ol.source.ImageWMS({
    url: "http://wms.geo.admin.ch/",
    params: {
        "LAYERS": "ch.swisstopo.pixelkarte-grau"
    }
});

var layer = new ol.layer.Image({
    ratio: 1,
    source: source
});

//Instanzierung Mausposition
var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:2056',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
  });

//Instanziierung Karte mit Layer
var map = new ol.Map({
    controls: ol.control.defaults().extend([mousePositionControl]),
  	interactions: ol.interaction.defaults().extend([new ol.interaction.DragRotateAndZoom()]),
    layers: [layer, vector],
    target: document.getElementById("map"),
    view: new ol.View({
        center: [2692800, 1251000],
        zoom: 10,
        projection: new ol.proj.Projection({
            code: "EPSG:2056",
            units: "m"
        })
    })
});

/* Punkte verschieben
const modify = new ol.interaction.Modify({ source: vectorSource });
map.addInteraction(modify);*/

//Instanzierung   Übersichtskarte
const rotateWithView = document.getElementById('rotateWithView');

var sourceOverwiew = new ol.source.ImageWMS({
	url: "https://wms.geo.admin.ch/",
	params: {
		"LAYERS": "ch.swisstopo.pixelkarte-grau"
	}
});
var layerOverview = new ol.layer.Image({
	source: sourceOverwiew
});

const overviewMapControl = new ol.control.OverviewMap({
    // see in overviewmap-custom.html to see the custom CSS used
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [layerOverview],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,
    view: new ol.View({
      minZoom: 4.75,
      projection: new ol.proj.Projection({
          code: 'EPSG:2056',
          units: 'm'
      })
  }),
  });
  
  rotateWithView.addEventListener('change', function () {
    overviewMapControl.setRotateWithView(this.checked);
  });
  
  map.addControl(overviewMapControl);



