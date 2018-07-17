import React from 'react';
import PropTypes from 'prop-types';
import {
  VictoryTooltip,
} from 'victory';

class PieTooltip extends React.Component {
  static defaultEvents = VictoryTooltip.defaultEvents

  render() {
    const { datum, resultCount } = this.props;
    return (
      <VictoryTooltip
        {...this.props}
        text={`${datum.x}\n${datum.y}\n${Math.round((datum.y / resultCount) * 100)}%`}
      />
    );
  }
}

PieTooltip.propTypes = {
  datum: PropTypes.object,
  resultCount: PropTypes.number.isRequired,
};

export default PieTooltip;
