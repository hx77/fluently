import React from 'react';
import Recorder from 'js-audio-recorder';


class AudioRecorder extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      recording: false,
      btnText: "RECORD",
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
        this.props.getBlob(blob)
        this.setState({ recording: false, btnText: "RECORD" });
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
            <button onClick={this.recordBtnOnClick} className="btn btn-primary w-100 mb-3 py-3">{this.state.btnText}</button>
          </div>
          <div className="col-md-6">
            <button onClick={this.playBtnOnClick} className="btn btn-secondary w-100 mb-3 py-3">REPLAY</button>
          </div>
        </div>
      </div>
    )
  }
}

export default AudioRecorder;
