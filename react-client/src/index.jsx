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
    // this.reactQuillRef = null;
    // this.myRef = React.createRef();
    // this.attachQuillRefs = this.attachQuillRefs.bind(this);
    this.loadQR = this.loadQR.bind(this)
    this.click = this.click.bind(this);
  }

  componentDidMount() {
    // this.attachQuillRefs()
  }


  componentDidUpdate() {
    // this.attachQuillRefs()
  // console.log("My component is updating")
  //   if(this.state.mode === 'editor') {
  //     var editor = new Quill('.editor');
  //   }
  }

  // attachQuillRefs() {
  //   if (typeof this.reactQuillRef.getEditor !== 'function') return;
  //   this.quillRef = this.reactQuillRef.getEditor();
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

  // attachQuillRefs() {
  //   console.log('this inside attachQuillRefs: ', this)
  //   // if (typeof this.reactQuillRef.getEditor !== 'function') return;
  //   // this.quillRef = this.reactQuillRef.getEditor();
  // }

  loadQR(qr) {
    // console.log('qr: ', qr)
    this.quillRef = qr;
    this.oldContent = this.quillRef.getContents();
    console.log('this.oldContent: ', this.oldContent)
    // console.log('this.quillRef: ', this.quillRef)
    // this.setState({quillRef: qr})
    // console.log('this.state.quillRef: ', this.state.quillRef)
  }

  save() {
    var newContent = this.quillRef.getContents()
    var diff = this.oldContent.diff(newContent)
    console.log('diff: ', diff)



    // this.quillRef.on('editor-change', function(eventName, ...args) {
    //   if (eventName === 'text-change') {
    //     console.log("I AM INSIDE TEXT_CHANGE")
    //     // args[0] will be delta
    //   } else if (eventName === 'selection-change') {
    //     // args[0] will be old range
    //   }
    // });
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
        // console.log("Clicked inside editor! ", this)
        // this.forceUpdate();
        break;
      default:
      console.log('mode not recognized')
    }

    // if(this.state.mode === )
    // this.setState({mode: 'editor'});
    // console.log('Edit clicked!')
    // this.forceUpdate();
    // var editor = new Quill('.editor');

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
    // let button = this.state.mode ? 'pull request' : 'fork';
  const mode = this.state.globeMode ? ( <Globe title={this.state.title} content={this.state.content} button={button}/> ) : ( <Chapter mode={this.state.mode} title={this.state.title} content={this.state.content} edit={this.edit} loadQR={this.loadQR} button={button}/> );
    return (<div>
      {mode}
      <button onClick={this.click}>{button}</button>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));