import React from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';


class Chapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    console.log("Chapter mounting")
    if(this.props.mode === 'editor') {
      var options = {
        debug: 'infxo',
        modules: {
          clipboard: {
            matchVisual: true
          },
          toolbar: '#toolbar'
        }
      };
      var editor = new Quill('.editor-container', options);
      var change = new Delta();
      editor.on('text-change', function(delta) {
        change = change.compose(delta);
        console.log(change)
      });
    }
  }

  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <div className="editor-container">
        <div>{this.props.content}</div>
        </div>
      </div>
    )
  }
}

export default Chapter;