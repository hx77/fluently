import React from 'react';


class AssessmentTableRow extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        assessment: {
          "sentence_performance": {},
          "word_performance": {}
        }
      }
  };

  render() {
    return (
      <tr>
        <th>{ this.props.assessment.sentence_performance.accuracy }</th>
        <th>{ this.props.assessment.sentence_performance.pronunciation }</th>
        <th>{ this.props.assessment.sentence_performance.completeness }</th>
        <th>{ this.props.assessment.sentence_performance.fluency }</th>
      </tr>
    )
  };
}

export default AssessmentTableRow;
