import React from 'react';
import axios from 'axios';
import FormData from'form-data';
import MovieLine from './MovieLine'
import AudioRecorder from './AudioRecorder';
import AssessmentTable from './AssessmentTable';


class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      blob: null,
      assessment: null
    }
  }
  
  getBlob = (blob) => {
    this.setState({ blob: blob })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.blob !== prevState.blob) {
      this.getAssessment()
    }
  }

  getAssessment = async () => {
    let formData = new FormData();
    
    formData.append('file', this.state.blob, 'speech.wav');
    
    let response = await axios({
      method: "POST",
      url: 'http://127.0.0.1:5000/assess',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: formData
    });
    // console.log(response.data)
    this.setState({ assessment: response.data })
  }

  render() {
    return (
      <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-2 mb-3">
          <a class="navbar-brand mx-auto" href="#">Fluently</a>
        </nav>
        <div className="container">
          <MovieLine assessment={this.state.assessment} />
          <AudioRecorder getBlob={this.getBlob} />
          <AssessmentTable assessment={this.state.assessment} />
        </div>
      </div>
    )
  }
}

export default App;
