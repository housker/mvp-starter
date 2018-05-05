import React from 'react';
// import createRef from 'create-react-ref';
import ReactQuill from 'react-quill';
import $ from 'jquery';
// import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
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
  }

  componentDidMount() {
        console.log('this.props.mode: ', this.props.mode)
    this.props.loadChapter();
  }

  componentDidUpdate() {
    if(this.quillRef === null && this.props.mode === 'editor' && typeof this.reactQuillRef.getEditor === 'function') {
      this.quillRef = this.reactQuillRef.getEditor();
      this.props.loadQR(this.quillRef)
    }
  }




  render() {
    const mode = this.props.mode === 'editor' ? ( <ReactQuill className="content" ref={(el) => { this.reactQuillRef = el }} modules={this.state.modules} theme="bubble" value={this.props.content.__html} onChange={this._handleChange} onChangeSelection={this._handleChangeSelection} /> ) : ( <div className="content" dangerouslySetInnerHTML={this.props.content} ></div> );
    return (
      <div>
      <h2 id="title" className="title" onMouseEnter={this.props.reveal} onMouseLeave={this.props.hide}>{this.props.title}</h2>
      {this.props.isHovering && this.props.mode === "chapter" && <nav className="votes">
      <input onClick={this.props.upVote} className="button" type="image" src="chevron-up.png" />
      <input onClick={this.props.downVote} className="button" type="image" src="chevron-down.png" />
      </nav>}
      <div className="chapter">
        {mode}
      </div>
      </div>
    )
  }
}

export default Chapter;