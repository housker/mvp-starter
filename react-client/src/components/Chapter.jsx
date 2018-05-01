import React from 'react';
// import createRef from 'create-react-ref';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import ReactDOM from 'react-dom';
import Quill from 'quill';
import Delta from 'quill-delta';


class Chapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // oldQuill: {}
      // api: '',
      // user: ''
    }
    this.quillRef = null;
    this.reactQuillRef = null;
    // this.oldContent = {};
    this.change = new Delta();
    this._handleChange = this._handleChange.bind(this);
    this._handleChangeSelection = this._handleChangeSelection.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    // this.props.attachQuillRefs.bind(this);
    // React.createRef();
    // this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    // console.log('This in componentDidMount: ', this)
    // if(this.props.mode === 'editor') {
    //   this.props.attachQuillRefs()
    // }
  }

  componentDidUpdate() {
    if(this.quillRef === null && this.props.mode === 'editor' && typeof this.reactQuillRef.getEditor === 'function') {
      this.quillRef = this.reactQuillRef.getEditor();
      this.props.loadQR(this.quillRef)
      // this.oldContent = this.quillRef.getContents();
    }
  }

  // attachQuillRefs() {
  //   // console.log('this inside attachQuillRefs: ', this)
  //   if (typeof this.reactQuillRef.getEditor !== 'function') return;
  //   this.quillRef = this.reactQuillRef.getEditor();
  //   this.props.loadQR(this.quillRef)
  //   console.log('this.quillRef: ', this.quillRef)
  //   // console.log('this.quillRef.getContents(): ', this.quillRef.getContents())
  // }

  _handleChange(value, delta, source, editor) {
    // console.log('this: ', this)
    // console.log('value: ', value)
    // console.log('delta: ', delta)
    // console.log('source: ', source)
    // var myDelta = new Delta();
    // console.log('this.reactQuillRef: ', this.reactQuillRef)
    // this.reactQuillRef.on('text-change', delta => {
    //   myDelta = myDelta.compose(delta);
    //   console.log('myDelta: ', myDelta);
    // })

    // this.change = this.change.compose(delta)
    // console.log('this.change', this.change)
    // console.log('editor.getContents: ', editor.getContents())
    // console.log('this: ', this.refs.editor.focus())
    // if (source == 'user') {
    //   var accumulator = []
    //   accumulator.push(delta)
    //   console.log("Accumulator: ", accumulator)
    // }
  }

  _handleChangeSelection(range, source, editor) {
    // console.log('Arguments of _handleChangeSelection: ', arguments)

  }

  // accumulate() {

  // }

  render() {
    const mode = this.props.mode === 'editor' ? ( <ReactQuill ref={(el) => { this.reactQuillRef = el }} theme="bubble" value={this.props.content} onChange={this._handleChange} onChangeSelection={this._handleChangeSelection} /> ) : ( <div>{this.props.content}</div> );
    return (
      <div>
        <h2>{this.props.title}</h2>
        {mode}
      </div>
    )
  }
}

export default Chapter;