import './AssessmentTable.css'
import React from 'react';


class AssessmentList extends React.Component {
  
  render() {
    if (this.props.assessment) {
      return (
        <div className="text-center">
          <div>Accuracy {'>='}90: <span className="text-success">Green</span></div>
          <div>Accuracy {'>='}80: <span className="text-warning">Yellow</span></div>
          <div>Accuracy {'<'}80: <span className="text-danger">Red</span></div>
          <table className="table mx-auto">
            <caption className="caption-top">Sentence Pronunciation Assessment</caption>
            <thead>
              <tr class="thead-dark">
                <th scope="col">Accuracy</th>
                <th scope="col">Pronunciation</th>
                <th scope="col">Completeness</th>
                <th scope="col">Fluency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>{ this.props.assessment.sentence_performance.accuracy }</th>
                <th>{ this.props.assessment.sentence_performance.pronunciation }</th>
                <th>{ this.props.assessment.sentence_performance.completeness }</th>
                <th>{ this.props.assessment.sentence_performance.fluency }</th>
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

export default AssessmentList;
