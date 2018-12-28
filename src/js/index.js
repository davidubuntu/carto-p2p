const map = L.map('map', {
  zoomControl: false,
}).setView([40.4, -3.68], 12);

L.control.zoom({
  position: 'topright',
}).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

const client = new carto.Client({
  apiKey: 'j3OxoSBlrLexYxaueyY9hg',
  username: 'frontend',
});

const madridListings = new carto.source.Dataset('madrid_listings');

// Define basic styling options with CartoCSS
const style = new carto.style.CartoCSS(
  ` #layer {
           marker-fill: ramp([neighbourhood_group], (#38A6A5,#1D6996,#DDCC77,#0F8554,#73AF48,#EDAD08,#E17C05,#CC503E,#94346E,#6F4070,#88CCEE,#EDAD08,#73AF48,#CC6677,#7F3C8D,#11A579,#3969AC,#F2B701,#0F8554,#1D6996,#6F4070,#E73F74), ("Centro", "Chamberí", "Salamanca", "Arganzuela", "Retiro", "Tetuán", "Moncloa - Aravaca", "Chamartín", "Ciudad Lineal", "Latina","Carabanchel","Puente de Vallecas","Villa de Vallecas","Hortaleza","Usera","Fuencarral - El Pardo","San Blas - Canillejas","Moratalaz","Villaverde","Barajas","Vicálvaro","Other"), "=");
               marker-width: 7;
               marker-line-width: 0;
               marker-line-color: #FFFFFF; 
      }
        `,
);

// Defining the madridApartments layer
const madridApartments = new carto.layer.Layer(madridListings, style);

// Adding a layer to the client
client.addLayer(madridApartments)
  .then(() => {
    console.log('Layer added');
  })
  .catch((cartoError) => {
    console.log('Layer not added');
    console.error(cartoError.message);
  });

client.getLeafletLayer().addTo(map);

// Adding  madridListing Dataset and take neighbourhood group column from the table
const madridListingsDataView = new carto.dataview.Category(madridListings, 'neighbourhood_group', {
  limit: 18,
});

// Listening to data changes on the dataview
madridListingsDataView.on('dataChanged', (newData) => {
  refreshMadridListingsWidget(newData.categories);
});


// Define how the Widget updates with changes in  madridListingsDataView
const refreshMadridListingsWidget = (data) => {
  const updatedP2pData = data.map(neighbourhood => [neighbourhood.name, neighbourhood.value]).sort((a, b) => b[1] - a[1]);
  refreshChart(updatedP2pData);
};


// Instance of widget Chart
const p2pchart = new Highcharts.chart('p2pchart', {
  chart: {
    type: 'bar',
  },
  title: {
    text: null,
  },
  xAxis: {
    type: 'category',
    title: {
      text: 'Neighbourhood',
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Number of P2P apartaments',
    },
    labels: {
      overflow: 'justify',
    },
  },
  tooltip: {
    enabled: false,
    valueSuffix: 'number',
  },
  plotOptions: {
    bar: {
      borderRadius: 2,
      dataLabels: {
        enabled: true,
      },
    },
    series: {
      //   colorByPoint: true,
    },
  },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
  series: [{
    name: 'P2P apartments',
    data: null,
    cursor: 'pointer',
    point: {
      events: {
        click() {
          filterNeighbourhood(madridListings, this.name);
        },
      },
    },
  }],
  exporting: {
    enabled: true,
  },
});


// Draw widget  updates with changes in  madridListingsDataView
const refreshChart = (neighbourhood) => {
  const colors = {
    Centro: '#38A6A5',
    Chamberí: '#1D6996',
    Salamanca: '#DDCC77',
    Arganzuela: '#0F8554',
    Retiro: '#73AF48',
    Tetuán: '#EDAD08',
    Moncloa: '#E17C05',
    Chamartín: '#CC503E',
    Lineal: '#94346E',
    Latina: '#6F4070',
    Carabanchel: '#88CCEE',
    Puente: '#EDAD08',
    Villa: '#73AF48',
    Hortaleza: '#CC6677',
    Usera: '#7F3C8D',
    Fuencarral: '#11A579',
    Canillejas: '#3969AC',
    Moratalaz: '#F2B701',
    Villaverde: '#0F8554',
    Barajas: '#1D6996',
    Vicálvaro: '#6F4070',
    Other: '#E73F74',
  };
  const arr = [];
  const neighbourhoodColors = neighbourhood.map((n, i) => {
    Object.keys(colors).forEach((key) => {
      if (n[0].includes(key)) {
        arr.push({ name: n[0], y: n[1], color: colors[key] });
      }
    });
    return arr[i];
  });
  p2pchart.series[0].setData(neighbourhoodColors, true);
};


// Filter data selected from the widget
let SelectedFilter; // Save selected filter to be accesible and reset from resetLayerData
filterNeighbourhood = (dataView, neighbourhoodToFilter) => {
  SelectedFilter = new carto.filter.Category('neighbourhood_group', {
    eq: neighbourhoodToFilter,
  });
  dataView.addFilter(SelectedFilter);
};

// Reset previous Filter when clicking button
const resetLayerData = (dataView, filter) => {
  dataView.removeFilter(filter);
};

// Handle event listener when clicking reset button
document.getElementById('reset-layer').addEventListener('click', () => resetLayerData(madridListings, SelectedFilter));


// 5 Adding the bounding box filter and Defining the bounding box filter for the map
const boundingFilter = new carto.filter.BoundingBoxLeaflet(map);
madridListingsDataView.addFilter(boundingFilter);

// Addd dataview to the client
client.addDataview(madridListingsDataView)
  .then(() => {
    console.log('Dataview added');
  })
  .catch((cartoError) => {
    console.error(cartoError.message);
  });
