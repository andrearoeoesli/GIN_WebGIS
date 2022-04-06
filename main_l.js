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

//Instanziierung Kanton Source mit einer WFS GetFeature Abfrage
var kantonSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: function (extent) {
      return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=Pfadi_Lagerplatz:Kantonsgebiet&' +
          'outputFormat=application/json';
  },
  strategy: ol.loadingstrategy.bbox
});

//Instanziierung Vector Layers mit einer Source und Darstellung
var vector = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
      fill: new ol.style.Fill({
          color: 'rgba(0, 255, 21, 0.5)'
      }),
      stroke: new ol.style.Stroke({
          color: 'green',
          width: 1
      })
  })
});

//Instanziierung Kanton Layers mit einer Source und Darstellung
var kanton = new ol.layer.Vector({
  source: kantonSource,
  style: new ol.style.Style({
      stroke: new ol.style.Stroke({
          color: 'black',
          width: 2
      })
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
  layers: [layer, kanton, vector],
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


map.addControl(overviewMapControl);


// PDF erstellen mit Funktion jsPDF in Hochformat in A4
var pdf = new jsPDF ( {
orientation: "portrait",
unit: "mm",
format: [210,297]
});

 // Designe PDF Plan
pdf.setFontSize(25);                          // Schriftgröße
pdf.setFont("arial")                          // Schriftart
pdf.setFontType("bold")                       // Schrifttyp
pdf.text ("Zeltlager Plan", 20, 30);
pdf.setFontSize(15);                          // Schriftgröße
pdf.setFont("arial")                          // Schriftart
pdf.setFontType("normal")                     // Schrifttyp
pdf.text ("by J.Lippuner, J.Bachmann, A.Röösli", 20, 37);

pdf.setLineWidth(0.5);
pdf.setDrawColor(220,220,220);                // Farbe für Linien als RGB-Werte
pdf.rect (20, 50, 170, 217);                  // Viereck 150mm auf 167mm

//Nordpfeil einfügen
let img = new Image();
img.addEventListener("load", function() {
    pdf.addImage(img, 'png', 165, 55, 20, 20);
});
img.src = "nordpfeil.png";

pdf.text("Massstab:", 22, 265);

//Button getätigt -> download PDF 
document.querySelector("#laden").onclick = function () {
pdf.save ("Lagerplan.pdf");
}
