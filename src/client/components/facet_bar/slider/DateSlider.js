import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { Handle, Track, Tick, TooltipRail } from './SliderComponents';

const sliderRootStyle = {
  position: 'relative',
  width: '100%',
};

const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
  }
});

const defaultValues = [-1000, 1975];

class DateSlider extends Component {
  state = {
    domain: [-1000, 1975],
    values: defaultValues.slice(),
    update: defaultValues.slice(),
    reversed: false,
  }

  onUpdate = update => {
    this.setState({ update });
  }

  onChange = values => {
    this.setState({ values });
  }

  setDomain = domain => {
    this.setState({ domain });
  }

  toggleReverse = () => {
    this.setState(prev => ({ reversed: !prev.reversed }));
  }

  render() {
    const {
      state: { domain, values, reversed },
    } = this;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Slider
          mode={1}
          step={1}
          domain={domain}
          reversed={reversed}
          rootStyle={sliderRootStyle}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={values}
        >
          <Rail>{railProps => <TooltipRail {...railProps} />}</Rail>
          <Handles>
            {({ handles, activeHandleID, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    isActive={handle.id === activeHandleID}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={10}>
            {({ ticks }) => (
              <div className="slider-ticks">
                {ticks.map(tick => (
                  <Tick key={tick.id} tick={tick} count={ticks.length} />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </div>
    );
  }
}

DateSlider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateSlider);
