import React from 'react';
import MovieLine from './MovieLine'
import AudioRecorder from './AudioRecorder';


class App extends React.Component {
  
  render() {
    return (
      <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-2 mb-3">
          <a class="navbar-brand mx-auto" href="#">Fluently</a>
        </nav>
        <div className="container">
          {/* <h1 className="text-center">Fluently</h1> */}
          <MovieLine />
          <AudioRecorder />
        </div>
      </div>
    )
  }
}

export default App;
