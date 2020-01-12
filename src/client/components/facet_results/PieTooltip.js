import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryTooltip
} from 'victory'

const styles = {
  toolTip: {
    fontSize: 24
  },
  flyOut: {
    strokeWidth: 3
  }
}

class PieTooltip extends React.Component {
  static defaultEvents = VictoryTooltip.defaultEvents

  render () {
    const { datum, resultCount } = this.props
    return (
      <VictoryTooltip
        {...this.props}
        flyoutStyle={styles.flyOut}
        style={styles.toolTip}
        text={`${datum.x} (${datum.y})\n${Math.round((datum.y / resultCount) * 100)}%`}
      />
    )
  }
}

PieTooltip.propTypes = {
  datum: PropTypes.object,
  resultCount: PropTypes.number.isRequired
}

export default PieTooltip
