import React from 'react';
// import createRef from 'create-react-ref';
import ReactQuill from 'react-quill';
import $ from 'jquery';
// import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
import Quill from 'quill';
import Delta from 'quill-delta';


class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: {clipboard: {matchVisual: false}}
    }
    this.quillRef = null;
    this.reactQuillRef = null;
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    if(this.quillRef === null && this.props.mode === 'editor' && typeof this.reactQuillRef.getEditor === 'function') {
      this.quillRef = this.reactQuillRef.getEditor();
      this.props.loadQR(this.quillRef)
    }
  }




  render() {
    return (
      <div>
      <h2 id="title" onMouseEnter={this.props.reveal} onMouseLeave={this.props.hide}>{this.props.title}</h2>
      <ReactQuill className="content" ref={(el) => { this.reactQuillRef = el }} modules={this.state.modules} theme="bubble" />
      </div>
    )
  }
}

export default Editor;