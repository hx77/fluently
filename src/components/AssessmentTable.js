import React from 'react';
import AssesmentTableRow from './AssesmentTableRow'

class AssessmentList extends React.Component {
  
  render() {
    return (
      <div className="text-center">
        {/* <h2>Pronunciation Assessment</h2> */}
        <table className="table mx-auto">
          <thead>
            <tr class="thead-dark">
              <th scope="col">Accuracy</th>
              <th scope="col">Pronunciation</th>
              <th scope="col">Completeness</th>
              <th scope="col">Fluency</th>
            </tr>
          </thead>
          <tbody>
            <AssesmentTableRow assessment={this.props.assessment} />
          </tbody>
        </table>
      </div>
    )
  }
}

export default AssessmentList;
