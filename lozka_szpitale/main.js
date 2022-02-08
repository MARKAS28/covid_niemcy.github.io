$(document).ready(function () {
  var mapboxAccessToken = 'pk.eyJ1IjoibWlraW5pdSIsImEiOiJja3o3NXN3dzAwZ2R5MndxbW8ybzBob3puIn0.ngE2qPdfqsRFP0Yv6unN2g';
  var map = L.map('map').setView([50.424165, 10.528486], 6);
  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1
  }).addTo(map);

  // let atrybut = ["mar20"]; 


// var slider = L.control.timelineSlider({
//   timelineItems: ["Marzec 2020", "Maj 2020", "Sierpień 2020", "Listopad 2020", "Luty 2021", "Maj 2021", "Sierpień 2021", "Paździenik 2021"],
//   timelineSlider:["mar20", "maj20", "sie20", "lis20", "lut21", "maj21", "sie21", "paz21" ],
//   changeMap: function ({ label: label, value: value, map: map }) {
//     tab = ["mar20", "maj20", "sie20", "lis20", "lut21", "maj21", "sie21", "paz21"];
//     value = tab[value-1];
//     atrybut=value;
//     geojson = L.geoJson(landsData4, {
//       style: style,
//       onEachFeature: onEachFeature
//   }).addTo(map);
  
//   },
// }).addTo(map);

  var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};


info.update = function (props) {
    this._div.innerHTML = '<h4>Dane na temat pandemii COVID-19<br/> w Niemczech</h4>'+'Łożka szpitalne'+'<br/>'+ (props ?
        '<b>' + props.NAME_1 + '</b><br />' + parseInt(props.lozka_szp*100) + ' współczynnik na 100 000 mieszkańców'
        : 'Wybierz dowolny Land');
};

info.addTo(map);

  function getColor(d) {
    return d > 2000  ? '#ffffff' : 
           d > 1400 ? '#ffd5d5' : 
           d > 800  ? '#ffaaaa' :
           d > 400   ? '#ff8080' :
           d > 200   ? '#ff5555' :
           d > 100   ? '#ff2a2a' :
                    '#ff0000' ;
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties.lozka_szp*100), 
      weight: 2,
      opacity: 1,
      color: 'gray',
      fillOpacity: 1,
      
  };
}

L.geoJson(landsData4, {style: style}).addTo(map);

    function highlightFeature(e) {
      var layer = e.target;
  
      layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 1,
      });
      info.update(layer.feature.properties);
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

      var geojson;


      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }
  
    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
    layer.bindPopup(feature.properties.NAME_1);
}

geojson = L.geoJson(landsData4, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

     
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 200, 400, 800, 1400, 2000],
        labels = ['Bardzo niski','Niski','Umiarkowany','Średni','Podwyższony','Wysoki','Bardzo wysoki','Krytyczny'];
        div.innerHTML ="<b>Legenda</b>:<br/>"
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) +'"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' '+labels[i] + '<br>' : '+'+ ' '+labels[i]);
    }

    return div;
};

legend.addTo(map);

});
