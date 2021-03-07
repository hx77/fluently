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

  setColor = (accuracy) => {
    if (accuracy > 90) {
      return "text-success"
    } else if (accuracy > 80) {
      return "text-warning"
    } else {
      return "text-danger"
    }
  }

  getColorList = (assesment) => {
    let colorList = [];

    if (assesment) {
      let wordPerformanceList = assesment.word_performance
      for (let i = 0; i < wordPerformanceList.length; i++) {
        colorList.push(this.setColor(wordPerformanceList[i].accuracy))
      }
    }
    
    return colorList
  }

  splitLine = (colorList) => {
    let wordList = this.state.movieLine.split(' ')
    console.log(wordList)
    console.log(colorList)
    
    const jsx = wordList.map((word, idx) => {
      return <span className={colorList[idx]} id="movieline">{word} </span>
    })
    return jsx
  }

  movieLineJSX = () => {
    console.log(this.props.assessment)
    
    if (this.props.assessment) {
      let colorList = this.getColorList(this.props.assessment)
      return this.splitLine(colorList)
    }
    return (
      <div className="text-left" id="movieline">{this.state.movieLine}</div>
    )
  }

  render() {
    return (
      <div className="text-center">
        <div className="row align-items-end pb-5 px-5">
          <div className="col-md-8">
            {this.movieLineJSX()}
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
