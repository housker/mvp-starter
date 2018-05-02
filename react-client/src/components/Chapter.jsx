import React from 'react';
// import createRef from 'create-react-ref';
import ReactQuill from 'react-quill';
import $ from 'jquery';
// import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
import Tooltip from 'react-qtip';
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
    // this.getSelectionText = this.getSelectionText.bind(this);
    // this.getSelectionHtml = this.getSelectionHtml.bind(this);
    // this.setQtip = this.setQtip.bind(this);
    // this._handleChange = this._handleChange.bind(this);
    // this._handleChangeSelection = this._handleChangeSelection.bind(this);
  }

  componentDidMount() {
    // this.setQtip()
    // console.log('this.props.content.__html: ', this.props.content.__html)
  }

  componentDidUpdate() {
    console.log('this.props.content.__html: ', this.props.content.__html)
    if(this.quillRef === null && this.props.mode === 'editor' && typeof this.reactQuillRef.getEditor === 'function') {
      this.quillRef = this.reactQuillRef.getEditor();
      this.props.loadQR(this.quillRef)
    }
  }



// getSelectionText() {
//     var text = "";
//     if (window.getSelection) {
//         text = window.getSelection();
//         // console.log('text in getSelectionText: ', text.toString())
//         console.log('getSelection: ', text)
//     } else if (document.selection && document.selection.type != "Control") {
//         text = document.selection.createRange().text;
//         console.log('text in getSelectionText when type != Control: ', text)
//     }
//     return text;
// }

getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        var node = sel.anchorNode;
        console.log('sel.anchorNode: ', window.getComputedStyles(node.parentElement))
        // var style = window.getComputedStyle(node)
        // var style = window.getComputedStyle(sel, null);
        // console.log('style of selection: ', style)
        if (sel.rangeCount) {
            var container = document.createElement("div");
            console.log('container: ', container)
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
                console.log('container in loop: ', container)
            }
            html = container.innerHTML;
            console.log('selected html: ', html)
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

// setQtip() {
//   $('div').each(function () {
//   console.log("Inside componentDidMount")
//   $(this).qtip({
//       content: $(this).next('.tooltiptext'),
//       hide: {
//         fixed: true,
//         delay: 300
//       }
//     });
//   });

// }


  // _handleChange(value, delta, source, editor) {
  // }

  // _handleChangeSelection(range, source, editor) {
  // }

  render() {
    // let delta = JSON.parse(this.props.content)
    const mode = this.props.mode === 'editor' ? ( <ReactQuill ref={(el) => { this.reactQuillRef = el }} modules={this.state.modules} theme="bubble" value={this.props.content.__html} onChange={this._handleChange} onChangeSelection={this._handleChangeSelection} /> ) : ( <div dangerouslySetInnerHTML={this.props.content} onMouseUp={this.getSelectionHtml}></div> );
    return (
      <div>
        <Tooltip text="test"><h2>{this.props.title}</h2></Tooltip>
        {mode}
      </div>
    )
  }
}

export default Chapter;