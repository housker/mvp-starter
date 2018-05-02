//ToDo: Sanitize editor input
//https://github.com/quilljs/quill/issues/510

//ToDo: update database when vote

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
import Editor from './components/Editor.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      quillRef: {},
      globeMode: false,
      mode: 'chapter',
      title: 'Boulder, CO',
      isHovering: false,
      votes: 0,
      content: { __html: '<p><span style="color:#003700;background-color:#cce8cc">Lots</span> of words are here</p>'}
    }
    this.quillRef = null;
    this.oldContent = {};
    this.loadQR = this.loadQR.bind(this)
    this.click = this.click.bind(this);
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.reveal = this.reveal.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/items',
      success: (data) => {
        this.setState({
          items: data,
          title: data[0].title,
          content: {__html: data[0].content},
          votes: data[0].votes,
        })
        console.log("this.state.items: ", this.state.items)
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  // componentDidUpdate() {
  // }

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

    this.setState({votes: 0})


    fetch('/items', {
      method: 'POST',
      body: JSON.stringify({
        title: this.state.title,
        content: html,
        votes: this.state.votes,
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(jsonRes => console.log('jsonRes: ', jsonRes))
    .catch(err => console.log(err));
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

    this.setState({content: {__html: html}})
  }


reveal() {
  this.setState({isHovering: !this.state.isHovering})
}

hide() {
  setTimeout(() => this.setState({isHovering: !this.state.isHovering}), 1000)
}

upVote() {
  // fetch('/items', {
  //   method: 'PUT'
  // })
  this.setState({votes: ++this.state.votes});
  console.log(this.state.votes)
}

downVote() {
  // fetch('/items', {
  //   method: 'PUT'
  // })
  this.setState({votes: --this.state.votes});
  console.log(this.state.votes)
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
  const mode = this.state.globeMode ? ( <Globe title={this.state.title} content={this.state.content} button={button}/> ) : ( <Chapter mode={this.state.mode} title={this.state.title} upVote={this.upVote} downVote={this.downVote} votes={this.state.votes} reveal={this.reveal} hide={this.hide} isHovering={this.state.isHovering} content={this.state.content} edit={this.edit} loadQR={this.loadQR} button={button}/> );
    return (<div>
      {mode}
      <button className="main" onClick={this.click}>{button}</button>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));