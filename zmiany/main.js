$(document).ready(function () {
  var mapboxAccessToken = 'pk.eyJ1IjoibWlraW5pdSIsImEiOiJja3o3NXN3dzAwZ2R5MndxbW8ybzBob3puIn0.ngE2qPdfqsRFP0Yv6unN2g';
  var map = L.map('map').setView([50.424165, 10.528486], 6);
  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1
  }).addTo(map);

  let atrybut = ["marmaj20"]; 


var slider = L.control.timelineSlider({
  timelineItems: ["Marzec-Maj</br>2020", "Maj-Sierpień</br>2020", "Sierpień-Listopad</br>2020", "Listopad 2020</br>-Luty 2021", "Luty-Maj</br>2021", "Maj-Sierpień</br>2021", "Sierpień-Paździenik</br>2021"],
  timelineSlider:["marmaj20", "majsie20", "sielis20", "lis20lut21", "lutmaj21", "majsie21", "siepaz21"],
  changeMap: function ({ label: label, value: value, map: map }) {
    tab = ["marmaj20", "majsie20", "sielis20", "lis20lut21", "lutmaj21", "majsie21", "siepaz21"];
    value = tab[value-1];
    atrybut=value;
    geojson = L.geoJson(landsData7, {
      style: style,
      onEachFeature: onEachFeature
  }).addTo(map);
  
  },
}).addTo(map);

  var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};


info.update = function (props) {
    this._div.innerHTML = '<h4>Dane na temat pandemii COVID-19<br/> w Niemczech</h4>'+'Zmiana stopnia zagrożenia'+'<br/>'+ (props ?
        '<b>' + props.NAME_1 + '</b>'
        : 'Wybierz dowolny Land'); 
};

info.addTo(map);

  function getColor(d) {
    return d > 1.1*10  ? '#1a9641 ' :
           d > 0.9*10   ? '#a6d96a ' :
           d > (-0.9)*10   ? '#ffffc0 ' :
           d > (-1.1)*10 ? '#fd4145  ' :
                     '#d7191c ';
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties[atrybut]*10), 
      weight: 2,
      opacity: 1,
      color: 'gray',
      fillOpacity: 1,
      
  };
}

L.geoJson(landsData7, {style: style}).addTo(map);

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

geojson = L.geoJson(landsData7, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

     
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-2.1*10, -1.1*10, -0.9*10, 0.9*10, 1.1*10],
        labels = ['Znacznie zwiększone ryzyko','Zwiększone ryzyko','Stałe ryzyko','Mniejsze ryzyko','Znacznie zmniejszone ryzyko'];
        div.innerHTML ="<b>Legenda</b>:<br/>"
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) +'"></i> ' +
            (grades[i + 1] ? ' ' + ' '+labels[i] + '<br>' : ''+ ' '+labels[i]);
    }

    return div;
};

legend.addTo(map);

});
