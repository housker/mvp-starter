import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Quill from 'quill';
import ReactQuill from 'react-quill';
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
      content: 'Lots of words are here.'
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
    var diff = this.oldContent.diff(newContent)
    console.log('diff: ', diff)
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