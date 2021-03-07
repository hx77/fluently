import React from 'react';
import axios from 'axios';
import FormData from'form-data';
import Recorder from 'js-audio-recorder';
import AssessmentTable from './AssessmentTable';


class AudioRecorder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recording: false,
      btnText: "RECORD",
      assessment: {
        "sentence_performance": {},
        "word_performance": {}
      }
    }

    this.recorder = new Recorder({
      sampleBits: 16,
      sampleRate: 16000,
      numChannels: 1,
    });
  }

  recordBtnOnClick = async () => {
    if (this.state.recording === true) {
      try {
        let blob = this.recorder.getWAVBlob()
        let formData = new FormData();
        formData.append('file', blob, 'speech.wav');
        this.setState({ recording: false, btnText: "RECORD" });
        
        let response = await axios({
          method: "POST",
          url: 'http://127.0.0.1:5000/assess',
          headers: {
            "Content-Type": "multipart/form-data"
          },
          data: formData
        });
        
        let assessment = response.data
        this.setState({ assessment })

      } catch (error) {
        console.log(`${error.name} : ${error.message}`);
      }
    } else {
      try {
        await Recorder.getPermission();
        await this.recorder.start();
        this.setState({ recording: true, btnText: "STOP" });
      } catch (error) {
        console.log(`${error.name} : ${error.message}`);
      };
    }
  }

  playBtnOnClick = () => {
    this.recorder.play()
  }

  render() {
    return (
      <div className="my-5 text-center">
        <div className="row">
          <div className="col-md-6">
            <button onClick={this.recordBtnOnClick} className="btn btn-primary w-100 mb-5">{this.state.btnText}</button>
          </div>
          <div className="col-md-6">
            <button onClick={this.playBtnOnClick} className="btn btn-secondary w-100 mb-5">PLAY</button>
          </div>
        </div>
        <AssessmentTable assessment={this.state.assessment}/>
      </div>
    )
  }
}

export default AudioRecorder;
