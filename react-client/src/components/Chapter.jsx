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
      modules: {clipboard: {matchVisual: false}}
    }
    this.quillRef = null;
    this.reactQuillRef = null;
    // this._handleChange = this._handleChange.bind(this);
    // this._handleChangeSelection = this._handleChangeSelection.bind(this);
  }

  componentDidMount() {
    console.log('this.props.content.__html: ', this.props.content.__html)
  }

  componentDidUpdate() {
    console.log('this.props.content.__html: ', this.props.content.__html)
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
    // let delta = JSON.parse(this.props.content)
    const mode = this.props.mode === 'editor' ? ( <ReactQuill ref={(el) => { this.reactQuillRef = el }} modules={this.state.modules} theme="bubble" value={this.props.content.__html} onChange={this._handleChange} onChangeSelection={this._handleChangeSelection} /> ) : ( <div dangerouslySetInnerHTML={this.props.content}></div> );
    return (
      <div>
        <h2>{this.props.title}</h2>
        {mode}
      </div>
    )
  }
}

export default Chapter;