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
      movieTitle: '',
      colorList: [],
    }
  }

  loadMovieLine = async () => {
    const response = await axios.get('http://127.0.0.1:5000/line');
    this.setState({
      lineId: response.data.line_id,
      characterName: response.data.characterName,
      movieId: response.data.movie_id,
      movieLine: response.data.movie_line,
      movieTitle: response.data.movie_title,
      colorList: Array(response.data.movie_line.split(' ').length).fill("text-white"),
    });
  }
  
  componentDidMount() {
    this.setState(this.state, this.loadMovieLine)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.assessment !== this.props.assessment) {
      this.updateColorList();
    }
  }

  getColorClass = (accuracy) => {
    if (accuracy > 90) {
      return "text-success"
    } else if (accuracy > 80) {
      return "text-warning"
    } else {
      return "text-danger"
    }
  }
  
  updateColorList = () => {
    if (this.props.assessment) {
      let wordPerformanceList = this.props.assessment.word_performance;
      let colors = [];
      for (let i = 0; i < wordPerformanceList.length; i++) {
        colors.push(this.getColorClass(wordPerformanceList[i].accuracy));
      }
      this.setState({ colorList: colors });
    }
  }


  movieLineJSX = () => {
    const wordList = this.state.movieLine.split(' ');
    const line = wordList.map((word, idx) => {
      return <span className={this.state.colorList[idx]} id="movieline">{word} </span>
    })
    
    return <div className="text-left" id="movieline">{line}</div>
  }

  render() {
    return (
      <div className="text-center">
        <div className="row align-items-end pb-5 px-5">
          <div className="col-md-8">
            {this.movieLineJSX()}
          </div>
          <div className="col-md-3">
            <div className="font-italic text-capitalize text-right">
              — {this.state.movieTitle}
            </div>
          </div>
        </div>
        <button onClick={this.loadMovieLine} className="btn btn-secondary w-50 py-3">
          Get a Random Line From a Movie
        </button>
      </div>
    )
  }
}

export default MovieLine;
