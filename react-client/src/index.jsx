//ToDo: Sanitize editor input
//https://github.com/quilljs/quill/issues/510

import React from 'react';
import createFragment from 'react-addons-create-fragment';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import DeltaConverter from 'quill-delta-to-html';
import List from './components/List.jsx';
import Chapter from './components/Chapter.jsx';
import Editor from './components/Editor.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quillRef: {},
      globeMode: false,
      mode: 'chapter',
      title: 'Boulder, CO',
      content: { __html: '<p><span style="color:#003700;background-color:#cce8cc">Lots</span> of words are here</p>'}
    }
    this.quillRef = null;
    this.oldContent = {};
    this.loadQR = this.loadQR.bind(this)
    this.click = this.click.bind(this);
  }

  // componentDidMount() {
  // }

  // componentDidUpdate() {
  // }


    // $.ajax({
    //   url: '/items',
    //   success: (data) => {
    //     this.setState({
    //       items: data
    //     })
    //   },
    //   error: (err) => {
    //     console.log('err', err);
    //   }
    // });


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
      // if the change was an insertion
      if (op.hasOwnProperty('insert')) {
        // color it green
        op.attributes = {
          background: "#cce8cc",
          color: "#003700"
        };
      }
      // if the change was a deletion
      // if (op.hasOwnProperty('delete')) {
      //   // keep the text
      //   op.retain = op.delete;
      //   delete op.delete;
      //   // but color it red and struckthrough
      //   op.attributes = {
      //     background: "#e8cccc",
      //     color: "#370000",
      //     strike: true
      //   };
      // }
    }

      var adjusted = this.oldContent.compose(diff);
      console.log('adjusted: ', adjusted)
      var converter = new DeltaConverter(adjusted.ops, {});
      var html = converter.convert();
      console.log('html[0]: ', html[0])
      console.log('html: ', html)
      // html = "'" + html + "'"


      // this.quillRef.setContents(adjusted)
      // this.state.content = adjusted;
      // adjusted = JSON.stringify(adjusted)
      // var tempCont = document.createElement("div");
      // var newQuill = (new Quill(tempCont)).setContents(adjusted);
      // console.log('newQuill: ', newQuill)
      // // console.log(Array.isArray(adjusted))
      // // this.setState({content: adjusted})
      // html = {__html: html}
      // console.log('html: ', html)

      // html = html.toString()
      // html = JSON.stringify(html)

      console.log('this.state.content: ', this.state.content)

      this.setState({content: {__html: html}})
      console.log('this.state.content: ', this.state.content)
      // createFragment(adjusted)
      // this.setState({content: adjusted})
      // console.log('this.state.content: ', this.state.content)
      // this.quillRef.setContents(adjusted);



  }

  click() {
    switch (this.state.mode) {
      case 'globe':
        this.setState({mode: 'chapter'});
        break;
      case 'chapter':
        this.setState({mode: 'editor'});
        break;
      case 'editor':
        this.save();
        this.setState({mode: 'chapter'});
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
      default:
      console.log('mode not recognized')
    }
  const mode = this.state.globeMode ? ( <Globe title={this.state.title} content={this.state.content} button={button}/> ) : ( <Chapter mode={this.state.mode} title={this.state.title} content={this.state.content} edit={this.edit} loadQR={this.loadQR} button={button}/> );
    return (<div>
      {mode}
      <button onClick={this.click}>{button}</button>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));