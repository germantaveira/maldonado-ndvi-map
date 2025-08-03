// Crear el mapa
const map = L.map('map').setView([-34.9, -54.95], 12); // Ajustá según tu zona

// Agregar fondo
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Función para colorear según NDVI
function getColor(ndvi) {
  return ndvi > 0.6 ? '#006837' :
         ndvi > 0.4 ? '#31a354' :
         ndvi > 0.2 ? '#78c679' :
         ndvi > 0    ? '#c2e699' :
         '#ffffcc';  // valores bajos o negativos
}

// Estilo de cada barrio
function style(feature) {
  return {
    fillColor: getColor(feature.properties.ndvi_mean_2025),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };
}

// Cargar GeoJSON
fetch('barrios_ndvi.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: style,
      onEachFeature: function (feature, layer) {
        const nombre = feature.properties.NOMBRE || feature.properties.name || 'Barrio';
        const ndvi = feature.properties.ndvi_mean_2025?.toFixed(3);
        layer.bindPopup(`<strong>${nombre}</strong><br>NDVI: ${ndvi}`);
      }
    }).addTo(map);
  });

  // Crear la leyenda
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const grades = [0, 0.2, 0.4, 0.6];
  const labels = [];

  // Generar etiquetas con colores
  for (let i = 0; i < grades.length; i++) {
    const from = grades[i];
    const to = grades[i + 1];

    labels.push(
      '<i style="background:' + getColor(from + 0.01) + '"></i> ' +
      from + (to ? ' – ' + to : '+')
    );
  }

  div.innerHTML = '<h4>NDVI</h4>' + labels.join('<br>');
  return div;
};

legend.addTo(map);
