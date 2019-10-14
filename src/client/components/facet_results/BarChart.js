import React from 'react';
import PropTypes from 'prop-types';

class BarChart extends React.Component {
  componentDidMount = () => {
    this.props.fetchResults({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
    });
  }

  render() {
    console.log(this.props.data)
    return(<div></div>);
  }

}

BarChart.propTypes = {
  //classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  fetchResults: PropTypes.func.isRequired
};

export default BarChart;
