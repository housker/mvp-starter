//ToDo: Get dave function of newEditor to work

//Actually, scratch that, aqutomatically goes into editor, don't need to press button. Bug: when I click for editor after initing a new chapter, sends me to home screen when it should send me to editor and THEN homescreen -- or better yet, have small globe in upper right hand corner that can click to get back from chapter or editor.

//ToDo: Sanitize editor input
//https://github.com/quilljs/quill/issues/510

//ToDo: newEditor autopopulates title with city name, pull request button adds chapter to database and city to pings (POST req).

//ToDo: refactor swtich cases to use routes, so you can use the back button to get to the globe
//On componentDidMount in index.jsx, query database for all cities(titles), eliminate duplicates by grabbing max of id
//On componentDidMount in Chapter, grab the most recent for that title, and setState of conent then.

//ToDo: update database when vote

//Make votes responsive to selections within the chapter:
//https://stackoverflow.com/questions/5223412/window-getselection-add-class-to-selection-with-jquery

//Homepage: onMouseOver, display iframe with webcam of the area (qTip), click on location to open chapter
//https://developers.webcams.travel/

//for future implementations, consider adding a toolbar with information about travel, fed/state/local infrastructure investment, competitions in the area, volunteering, airBnB, etc.
//maybe next time use this, only saw this after setting up quill:
//https://draftjs.org/

import React from 'react';
import createFragment from 'react-addons-create-fragment';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import DeltaConverter from 'quill-delta-to-html';
import List from './components/List.jsx';
import Chapter from './components/Chapter.jsx';
import Globe from './components/Globe.jsx';
import Editor from './components/Editor.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      //'Minneapolis, US', 'Boulder, US', 'Cambridge, UK', 'Boston, US', 'Asunicion, Paraguay'
      coordinates: [],
      // items: [],
      // quillRef: {},
      mode: 'globe',
      title: '',
      isHovering: false,
      votes: 0,
      geolocation: [],
      content: { __html: '<p>There was a story.<span style="color:#003700;background-color:#cce8cc"> And this is the next part.</span></p>'}
    }
    this.quillRef = null;
    this.geocoder = undefined;
    this.oldContent = {};
    this.planet = undefined;
    this.geocoder = undefined;
    this.canvas = undefined;
    this.loadPlugin = this.loadPlugin.bind(this);
    this.loadCities = this.loadCities.bind(this);
    this.setPing = this.setPing.bind(this);
    this.loadChapter = this.loadChapter.bind(this);
    this.loadQR = this.loadQR.bind(this)
    this.click = this.click.bind(this);
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.reveal = this.reveal.bind(this);
    this.hide = this.hide.bind(this);
    this.updateVotes = this.updateVotes.bind(this);
    this.drawGlobe = this.drawGlobe.bind(this);
    // this.selectChapter = this.selectChapter.bind(this);
  }

  componentDidMount() {
    this.drawGlobe();
  }

  componentDidUpdate() {
    // this.canvas = document.getElementById('globe');
    // this.planet.draw(this.canvas);
  }

  drawGlobe() {
    this.planet = planetaryjs.planet();
    // this.planet = planet;
    this.geocoder =  new google.maps.Geocoder();
    // this.geocoder = geocoder;
    this.loadPlugin();
    this.loadCities();
    this.canvas = document.getElementById('globe');
    // this.canvas = canvas;
    // this.planet.draw(this.canvas);
  }

  loadCities() {
    $.ajax({
      url: '/cities',
      success: (data) => {
        console.log('data from cities request: ', data)
        var cities = data.map(obj => obj.title);
        var coordinates = data.map(obj => JSON.parse(obj.geolocation))
        console.log("these are coordinate on load: ", coordinates)
        console.log('titles: ', cities)
        this.setState({
          cities: cities
        //   items: data[0],
        //   // title: data[0].title,
        //   content: {__html: data[0].content},
        //   votes: data[0].votes
        })
        this.setState({coordinates: coordinates}, () => {
          this.state.coordinates.forEach(coordinate => {
            if(coordinate) {
              this.setPing(coordinate[1], coordinate[0]);
            }
          });
        });
        this.planet.draw(this.canvas);
        // console.log("this.state.items: ", this.state.items)
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  loadPlugin() {
    this.planet.loadPlugin(planetaryjs.plugins.earth({
      topojson: { file: './world-110m.json' },
      oceans:   { fill:  '#497287'},
      land:     { fill: '#000000'},
      borders:  { stroke: '#de8048'}
    }));
    this.planet.loadPlugin(planetaryjs.plugins.pings({color: 'yellow', ttl: 5000, angle: 10}));
    this.planet.loadPlugin(planetaryjs.plugins.drag());
  }

  setPing(lng, lat) {
    setInterval(() => {this.planet.plugins.pings.add(lng, lat, {color: 'white', ttl: 2000, angle: Math.random() * 8}, 250)}, (Math.random() * 2000) + 1000)
  }

  loadChapter() {
    console.log('loadChapter is being called!')
    $.ajax({
      url: `/items/${this.state.title}`,
      success: (data) => {
        console.log('data[0].votes in loadChapter: ', data[0].votes);
        this.setState({
          // items: data[0],
          geolocation: JSON.parse(data[0].geolocation),
          content: {__html: data[0].content},
          votes: data[0].votes
        })
        // console.log("this.state.items: ", this.state.items)
      },
      error: (err) => {
        console.log('err', err);
      }
    });

  }

  loadQR(qr) {
    this.quillRef = qr;
    this.oldContent = this.quillRef.getContents();
    console.log('this.oldContent: ', this.oldContent)
  }

  save() {
    var newContent = this.quillRef.getContents()
    console.log('newContent: ', newContent)
    var diff = this.oldContent.diff(newContent)
    console.log('diff: ', diff)

  for (var i = 0; i < diff.ops.length; i++) {
      var op = diff.ops[i];
      if (op.hasOwnProperty('insert')) {
        op.attributes = {
          background: "#cce8cc",
          color: "#003700"
        };
      }
    }

    var adjusted = this.oldContent.compose(diff);
    console.log('adjusted: ', adjusted)
    var converter = new DeltaConverter(adjusted.ops, {});
    var html = converter.convert();

    this.setState({votes: 0}, () =>{
      console.log('this.state.geolocation: ', this.state.geolocation)

      fetch('/items', {
        method: 'POST',
        body: JSON.stringify({
          title: this.state.title,
          geolocation: JSON.stringify(this.state.geolocation),
          content: html,
          votes: this.state.votes,
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(jsonRes => console.log('jsonRes: ', jsonRes))
      .then(jsonRes => this.setState({mode: 'globe'}))
      // .then(jsonRes => this.drawGlobe())
      // .then(this.loadCities())
      // .then(() => console.log("Loaded Cities!"))
      // .then(this.loadPlugin())
      // .then(() => console.log("LoadedPlugin!"))
      // .then(this.planet.draw(this.canvas))
      // .then(() => console.log("Drew Planet!"))
      .catch(err => console.log(err));
    })
    this.setState({content: {__html: html}})


   // this.loadCities()
   //            console.log('At end of newEditor this.state.mode: ', this.state.mode)
   //            this.loadPlugin();
   //      this.planet.draw(this.canvas);


    // $.ajax({
    //   url: '/items',
    //   type: 'POST',
    //   contentType: 'application/json',
    //   data: JSON.stringify(html),
    //   dataType: 'json',
    //   success: (data) => {
    //     this.setState({
    //       items: data
    //     })
    //   },
    //   error: (err) => {
    //     console.log('err', err);
    //   }
    // });
  }


reveal() {
  this.setState({isHovering: !this.state.isHovering})
}

hide() {
  setTimeout(() => this.setState({isHovering: !this.state.isHovering}), 1000)
}

upVote() {
  this.setState({votes: ++this.state.votes},() => {
    console.log('this.state.votes right before update: ', this.state.votes);
    this.updateVotes();
  });
  if(this.state.votes > 10) {

  let xmlString = this.state.content.__html;
  let parser = new DOMParser();
  let doc = parser.parseFromString(xmlString, "text/xml");
  var childContent = doc.childNodes[0].textContent;
  // var child2 = child1.textContent;
  // console.log('child2: ', child2);
  this.setState({content: { __html: `<p>${childContent}</p>`}}, () => {
    // console.log('this.state.content: ', this.state.content)
    this.updateVotes();
  })

  }
  // this.updateVotes();
  //if votes is ten, get rid of formatting, make permanent
}

downVote() {
  this.setState({votes: --this.state.votes}, () => {
    console.log('this.state.votes in downVote: ', this.state.votes)
    this.updateVotes();
    // if(this.state.votes < 5) {
      console.log('this.state.votes inside downVote if-statement: ', this.state.votes)
      this.setState({mode: 'globe'}, this.loadCities);
    // }
  });
  // this.updateVotes();
  //if votes is negative five, revert to earlier
  //if !permanent && there are no earlier chapters, delete city
}

updateVotes() {
  console.log("Updated votes on upVote with: ", this.state.votes)
  // console.log('updateVotes is being called!')
  // var xmlString = this.state.content.__html;
  // var parser = new DOMParser();
  // var doc = parser.parseFromString(xmlString, "text/xml");
  // console.log('doc: ', doc)
  // console.log('doc.childNodes: ', doc.childNodes)
  // var childContent = doc.childNodes[0].textContent;
  // // var child2 = child1.textContent;
  // // console.log('child2: ', child2);
  // this.setState({content: { __html: `<p>${childContent}</p>`}})
  // doc.removeChild(span)
  // console.log('doc after removeChildspan: ', doc)
  fetch('/votes', {
    method: 'PUT',
    body: JSON.stringify({
      votes: this.state.votes,
      title: this.state.title,
      content: this.state.content.__html
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(jsonRes => console.log('jsonRes: ', jsonRes))
  .catch(err => console.log(err));

}

// selectChapter(e) {
//   console.log('e inside selectChapter: ', e.target.value)
//   this.state.cities.includes(e.target.value) ? this.setState({mode: 'chapter'}) : this.setState({mode: 'newEditor'})
// }

  click() {
    console.log('this.state.mode: ', this.state.mode)
    switch (this.state.mode) {
      case 'globe':
        let city = this.cityInput.value;
        this.setState({title: city});
        // if(this.state.cities.includes(city)) {
        //   console.log("Match to cities")
        //   this.setState({mode: 'chapter'})
        // }

        this.state.cities.includes(city) ? this.setState({mode: 'chapter'}) :

         // else {
          // console.log('this.geocoder: ', this.geocoder)
          this.geocoder.geocode({'address': city}, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log('OK!');
              let geolocation = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
              console.log('geolocation before being set to state: ', geolocation)
              this.setState({geolocation: geolocation});
              this.setState({mode: 'newEditor'});
              // this.setPing(results[0].geometry.location.lng(), results[0].geometry.location.lat())
            // } else {
              console.log(status);
            // }
          }
        });
        break;
      case 'chapter':
        this.setState({mode: 'editor'});
        console.log('this.state.mode: ', this.state.mode)
        break;
      case 'editor':
        this.save();
        // this.setState({mode: 'chapter'});
                 // console.log('this.state.mode: ', this.state.mode)
        break;
      case 'newEditor':
        this.save();
        // this.setState({mode: 'globe'});
        // this.loadCities()
        //       console.log('At end of newEditor this.state.mode: ', this.state.mode)
        //       this.loadPlugin();
        // this.planet.draw(this.canvas);
        break;
      default:
      console.log('mode not recognized')
    }
  }

  render () {
    let button;
    switch (this.state.mode) {
      case 'globe':
        button = 'init';
        break;
      case 'chapter':
        button = 'fork';
        break;
      case 'editor':
        button = 'pull request';
        break;
      case 'newEditor':
        button = 'pull request';
        break;
      default:
      console.log('mode not recognized')
    }
    let mode;
    switch (this.state.mode) {
      case 'globe':
        // mode = <Globe ref={(el) => this.globe = el} mode={this.state.mode} title={this.state.title} content={this.state.content} geolocation={this.state.geolocation}  cities={this.state.cities} button={button}/>;
        mode =       <div>
        <h2 className="title">Git Saga</h2>
        <input ref={el => this.cityInput = el} className="cityInput" name="data" type="radio" list="data" type="text" placeholder="city, country" />
        <datalist className="dropdown" ref="dList" id="data" >
        {this.state.cities.map((city, i) => <option className="dropdown" key={i} value={city} />)}
        </datalist>
        <canvas onClick={this.takeLocation} id='globe' width='750' height='750'></canvas>
      </div>;
        break;
      case 'chapter':
        mode = <Chapter mode={this.state.mode} title={this.state.title} upVote={this.upVote} downVote={this.downVote} votes={this.state.votes} reveal={this.reveal} hide={this.hide} isHovering={this.state.isHovering} content={this.state.content} edit={this.edit} loadQR={this.loadQR} loadChapter={this.loadChapter} button={button}/>;
        break;
      case 'editor':
        mode = <Chapter mode={this.state.mode} title={this.state.title} upVote={this.upVote} downVote={this.downVote} votes={this.state.votes} reveal={this.reveal} hide={this.hide} isHovering={this.state.isHovering} content={this.state.content} edit={this.edit} loadQR={this.loadQR} button={button}/>;
        break;
      case 'newEditor':
        mode = <Editor className="editor" title={this.state.title} loadQR={this.loadQR} />;
        break;
      default:
      console.log('mode not recognized')
    }
    return (<div>
      {mode}
      <button className="main" onClick={this.click}>{button}</button>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));