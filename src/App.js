import React, { Component } from 'react';
import './App.css';
import { DarkSkyApiData } from './components/dark-sky-data'
import Loading from './components/loading'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    console.log(DarkSkyApiData)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Posh Weather</h1>
        </header>
        <p className="App-intro">
          New <code>App</code> coming soon
        </p>
      </div>
    );
  }
}

export default App;
