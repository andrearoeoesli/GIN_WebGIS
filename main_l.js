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

//Instanziierung Punkte Source mit einer WFS GetFeature Abfrage
var punkteSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: function (extent) {
      return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=Pfadi_Lagerplatz:punkte&' +
          'outputFormat=application/json';
  },
  strategy: ol.loadingstrategy.bbox
});

//Instanziierung Vector Layers mit einer Source und Darstellung
var vector = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
      fill: new ol.style.Fill({
          color: 'rgba(173, 221, 142, 0.5)'
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

//Instanziierung punkte Layers mit einer Source und Darstellung
x = 10;

var punkte = new ol.layer.Vector({
  source: punkteSource,
  style: new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'zelt.png',
        scale: 0.003*x,
    })
  })
});

var source = new ol.source.ImageWMS({
  url: "http://wms.geo.admin.ch/",
  params: {
      "LAYERS": "ch.swisstopo.pixelkarte-grau"
  },
  crossOrigin: "anonymous"
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
  layers: [layer, kanton, vector, punkte],
  target: document.getElementById("map"),
  view: new ol.View({
      center: [2692800, 1251000],
      zoom: 10,
      projection: new ol.proj.Projection({
          code: "EPSG:2056",
          units: "m"
      })
  }),
});

//Instanzierung Massstab für Skalierung von Symbolen



function onChange() {
  x = map.getView().getResolution();
  document.getElementById("test").innerHTML = x;
  map.removeLayer(punkte);
  map.addLayer(punkte)
};

map.on('moveend', onChange);

/* Punkte verschieben
const modify = new ol.interaction.Modify({ source: vectorSource });
map.addInteraction(modify);*/


var sourceOverwiew = new ol.source.ImageWMS({
url: "https://wms.geo.admin.ch/",
params: {
  "LAYERS": "ch.swisstopo.pixelkarte-grau"
},
crossOrigin: "anonymous"
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


// create pdf A4 high
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

//Insert north arrow
let img = new Image();
img.addEventListener("load", function() {
  pdf.addImage(img, 'png', 165, 230, 20, 20);
});
img.crossOrigin = 'Anonymous';
img.src = "nordpfeil.png";

pdf.setFontType("bold")
pdf.text("Legende", 20, 230);
pdf.setFontType("normal")
pdf.text("Optimale Standorte", 30, 237);
pdf.text("Spatz", 30, 244);
pdf.text("Sarasani", 30, 251);

pdf.setFillColor(173,221,142);
pdf.setDrawColor(0,128,0);
pdf.circle( 25, 235, 2, 'DF');
pdf.setFillColor(178,171,210);
pdf.setDrawColor(94,60,153);
pdf.circle( 25, 242, 2, 'DF');
pdf.setFillColor(253,184,99);
pdf.setDrawColor(230,97,1);
pdf.circle( 25, 249, 2, 'DF');

// get map size and resolution
const mapCanvas = document.createElement("canvas");
const size = map.getSize();
mapCanvas.width = size[0];
mapCanvas.height = size[1];

const viewResolution = map.getView().getResolution();

map.once('rendercomplete', function () {

});


//Button clicked -> download PDF 
document.querySelector("#laden").onclick = function () {
  const mapContext = mapCanvas.getContext('2d');
  Array.prototype.forEach.call(
    document.querySelectorAll('.ol-layer canvas'),
    function (canvas) {
      var i = 0;
      while (i < 1) {
        i++;
        // >800 um Miniansicht auszublenden
        if (canvas.width > 800) {
          const opacity = canvas.parentNode.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
          const transform = canvas.style.transform;
          // Get the transform parameters from the style's transform matrix
          const matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(',')
            .map(Number);
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          );
          console.log(canvas.toDataURL("image/png"))
          mapContext.drawImage(canvas, 0, 0);
        }
      }
    }
  );

  // dimension and position map in pdf
  dim = [170, 217];
  coord = [20, 50]
 
  // fill in Image
    console.log(mapCanvas.toDataURL('image/png'));
  pdf.addImage(
    mapCanvas.toDataURL('image/jpeg'),
    'JPEG',
    coord[0],
    coord[1],
    dim[0],
    dim[0] / size[0] * size[1]
  );
  // Reset original map size
  map.setSize(size);
  map.getView().setResolution(viewResolution);

  pdf.save ("Lagerplan.pdf");
}
