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
    }
    this.quillRef = null;
    this.reactQuillRef = null;
    // this._handleChange = this._handleChange.bind(this);
    // this._handleChangeSelection = this._handleChangeSelection.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    if(this.quillRef === null && this.props.mode === 'editor' && typeof this.reactQuillRef.getEditor === 'function') {
      this.quillRef = this.reactQuillRef.getEditor();
      this.props.loadQR(this.quillRef)
    }
  }

  // _handleChange(value, delta, source, editor) {
  // }

  // _handleChangeSelection(range, source, editor) {
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