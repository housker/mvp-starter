import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Quill from 'quill';
import List from './components/List.jsx';
import Chapter from './components/Chapter.jsx';
import Editor from './components/Editor.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globeMode: false,
      mode: 'chapter',
      title: 'Boulder, CO',
      content: 'Lots of words are here.'
    }
    this.edit = this.edit.bind(this);
  }

  componentDidMount() {
  }


  componentDidUpdate() {
  // console.log("My component is updating")
  //   if(this.state.mode === 'editor') {
  //     var editor = new Quill('.editor');
  //   }
  }

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

  edit() {
    this.setState({mode: 'editor'})
    console.log('Edit clicked!')
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
  const mode = this.state.globeMode ? ( <Globe title={this.state.title} content={this.state.content} button={button}/> ) : ( <Chapter mode={this.state.mode} title={this.state.title} content={this.state.content} edit={this.edit} button={button}/>);
    return (<div>
      {mode}
      <button onClick={this.edit}>{button}</button>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));