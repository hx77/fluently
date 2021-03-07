import './MovieLine.css'
import React from 'react';
import axios from 'axios';

class MovieLine extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      lineId: '',
      characterName: '',
      movieId: '',
      movieLine: '',
      movieTitle: ''
    }
  }

  loadMovieLine = async () => {
    const response = await axios.get('http://127.0.0.1:5000/line');
    this.setState({
      lineId: response.data.line_id,
      characterName: response.data.characterName,
      movieId: response.data.movie_id,
      movieLine: response.data.movie_line,
      movieTitle: response.data.movie_title
    })
  }
  
  componentDidMount() {
    this.setState(this.state, this.loadMovieLine)
  }

  render() {
    return (
      <div className="text-center">
        <div className="row align-items-end pb-5 px-5">
          <div className="col-md-8">
            <div className="text-left" id="movieline">{this.state.movieLine}</div>
          </div>
          <div className="col-md-3">
            <div className="font-italic text-capitalize text-right">— {this.state.movieTitle}</div>
          </div>
        </div>
        <button onClick={this.loadMovieLine} className="btn btn-secondary w-50 py-3">Get a Random Line From a Movie</button>
      </div>
    )
  }
}

export default MovieLine;
