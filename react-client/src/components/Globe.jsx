import React from 'react';
// import createRef from 'create-react-ref';
import ReactQuill from 'react-quill';
import $ from 'jquery';
// import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
// var planetaryjs = require('planetary.js');




class Globe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // cities: ['Minneapolis, US', 'Boulder, US', 'Cambridge, UK', 'Boston, US', 'Asunicion, Paraguay']
    }
    this.planet = undefined;
    this.geocoder = undefined;
    this.cityInput = null;
    this.loadPlugin = this.loadPlugin.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.setPing = this.setPing.bind(this);
    this.takeLocation = this.takeLocation.bind(this);


    // planetaryjs.plugins.drag({
    //   onDrag: function() {
    //     console.log("The planet was dragged!", this, d3.event);
    //   }
    // });
  }

  componentDidMount() {
    // console.log('this.refs.cityInput: ', this.refs.cityInput)
    // console.log('this.refs.dList.childNodes: ', this.refs.dList.childNodes)
    let planet = planetaryjs.planet();
    this.planet = planet;
    let geocoder =  new google.maps.Geocoder();
    this.geocoder = geocoder;
    this.loadPlugin();
    // this.props.cities.forEach(city => this.getCoordinates(city));
    var canvas = document.getElementById('globe');
    planet.draw(canvas);
  }

  componentDidUpdate() {
    this.props.cities.forEach(city => this.getCoordinates(city));
  }

  loadPlugin() {
    this.planet.loadPlugin(planetaryjs.plugins.earth({
      topojson: { file: './world-110m.json' },
      oceans:   { fill:  '#b0e0e6'},
      land:     { fill: '#000000'},
      borders:  { stroke: '#de8048'}
    }));
    this.planet.loadPlugin(planetaryjs.plugins.pings({color: 'yellow', ttl: 5000, angle: 10}));
    this.planet.loadPlugin(planetaryjs.plugins.drag());
  }

  getCoordinates(city) {
    this.geocoder.geocode({'address': city}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.setPing(results[0].geometry.location.lng(), results[0].geometry.location.lat())
      } else {
        console.log(status);
      }
    });
  }

  setPing(lng, lat) {
    setInterval(() => {this.planet.plugins.pings.add(lng, lat, {color: 'white', ttl: 2000, angle: Math.random() * 8}, 250)}, (Math.random() * 2000) + 1000)
  }

  takeLocation(e) {

    console.log('Clicked!', e.screenX, e.screenY)
    // console.log('e.region: '. e.region)

  }

  render() {
    // console.log('this.props.cities: ', this.props.cities)
    // this.props.cities.map(function(city) {
    //       console.log('city:', city);
    //     });
    return (
      <div >
        <h2 className="home">Git Saga</h2>
        <input ref={el => this.cityInput = el} className="cityInput" type="radio" list="data" type="text" placeholder="city, country" />
        <datalist ref="dList" id="data" >
        {this.props.cities.map((city, i) => <option key={i} value={city} />)}
        </datalist>
        <canvas onClick={this.takeLocation} id='globe' width='750' height='750'></canvas>
      </div>
    )
  }

}

export default Globe;








// var planet = planetaryjs.planet();

// d3.json('https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json', function(err, json) {

//   planet.loadPlugin(planetaryjs.plugins.earth({
//     topojson: { file: json.features },
//     oceans:   { fill:  '#11223d'},
//     land:     { fill: '#071c0d'},
//     borders:  { stroke: '#030a05'}
//   }));


//   console.log(json.features)
// })

// planet.loadPlugin(planetaryjs.plugins.earth({
//   topojson: { file: 'lib/world-110m.json' },
//   oceans:   { fill:  '#11223d'},
//   land:     { fill: '#071c0d'},
//   borders:  { stroke: '#030a05'}
// }));
// planet.loadPlugin(planetaryjs.plugins.pings({color: 'yellow', ttl: 5000, angle: 10}));
// planet.loadPlugin(planetaryjs.plugins.drag());



// window.onload = function() {
//   const cityInput = document.querySelector('.cityInput');
//   const request = document.querySelector('.request');
//   request.addEventListener('click', function() {getCoordinates(cityInput.value.toString())});
// }

// var defaultCities = ['Minneapolis, US', 'Boulder, US', 'Cambridge, UK', 'Boston, US', 'Asunicion, Paraguay']

// // ,'Mexico City, Mexico' 'Accra, Ghana', 'Shanghai, China', 'Cape Town, South Africa', 'Perth, Australia', 'Dubai, UAE']


// $('.cityInput').on('submit', function(){
//   console.log('clicked!')
// })

// var getCoordinates = function(city) {
//   var geocoder =  new google.maps.Geocoder();
//   geocoder.geocode({'address': city}, function(results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       setPing(results[0].geometry.location.lng(), results[0].geometry.location.lat())
//     } else {
//       console.log(status);
//     }
//   });
// }

// defaultCities.forEach(city => getCoordinates(city));

// function setPing(lng, lat) {
//   setInterval(function(){planet.plugins.pings.add(lng, lat, {color: 'white', ttl: 2000, angle: Math.random() * 8}, 250)}, (Math.random() * 2000) + 1000)
// }


//==============

// var context = d3.select('#globe')
//   .node()
//   .getContext('2d');

// var projection = d3.geoOrthographic()
//   .scale(500)
//   .rotate([30, -45]);

// var geoGenerator = d3.geoPath()
//   .projection(projection)
//   .context(context);

//   context.lineWidth = 0.5;
//   context.strokeStyle = '#333';

//   context.beginPath();
//   context.strokeStyle = 'red';
//   geoGenerator({type: 'Feature', geometry: {type: 'LineString', coordinates: [[0.1278, 51.5074], [-74.0059, 40.7128]]}});
//   context.stroke();





// d3.json('https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json', function(err, json) {
//   console.log(json)
// })


//====================



// planet.projection.scale(250).translate([250, 250]);
// var canvas = document.getElementById('globe');
// planet.draw(canvas);