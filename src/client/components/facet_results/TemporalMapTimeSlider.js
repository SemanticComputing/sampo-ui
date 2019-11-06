import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import iconImg from './icon.png';
import BarChart from './TemporalMapBarChart';


const blue = 'rgb(0, 126, 230)';

const styles = () => ({
  // slider: {
  //   color: blue,
  //   width: '99%',
  //   margin: '8px 0 30px 0',
  //   padding: '0 6px 0 6px',
  // },
  sliderRoot: {
    color: blue,
    width: '98%',
    margin: '8px 0 30px 0',
    padding: '0 6px 0 6px',
  },
  sliderThumb: {
    backgroundColor: blue,
    '&:after': {
      content: '""',
      borderRight: `3px solid ${blue}`,
      height: '26px',
      marginTop: '-36px'
    }
  }
});

class TemporalMapTimeSlider extends Component {
  state = {
    memory: [],
    currentDay: null,
    hideContainer: '',
    value: 0,
    maxValue: 100,
    sliderDuration: 200,
    intervalSetter: null,
    isPlaying: false,
    playOrPause: 'play',
    speedButtonActive: 'time-slider-speed-button--active',
    halfSpeedEnabled: false,
    regularSpeedEnabled: true,
    doubleSpeedEnabled: false
  };

  componentWillUnmount() {
    clearInterval(this.state.intervalSetter);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.memory !== this.props.memory) {
      this.setState({ memory: this.props.memory });
    }

    if (prevProps.dateUniques !== this.props.dateUniques) {
      const toSplitIn = 8;
      const interval = this.props.dateUniques.length / toSplitIn;
      const target = [];


      for (let i = 0; i < toSplitIn; i++) {
        target.push(this.props.dateUniques[Math.round(interval * i)]);
      }

      this.setState({
        maxValue: this.props.dateUniques.length,
        currentDay: this.props.dateUniques.length > 10 ? target : this.props.dateUniques
      });
    }
  };

  _handleSliderChange = (t, newValue) => {
    const { maxValue } = this.state;

    this.setState({ value: newValue });
    this.props.animateMap([newValue, maxValue]);
  };

  _animate = () => {
    const { value, maxValue } = this.state;

    if (value <= maxValue) {
      this.setState(
        {
          value: parseInt(value) + 1,
          isPlaying: true
        },
        () => {
          this.props.animateMap([value, maxValue]);
        }
      );
    }

    if (value == maxValue) {
      this._handlePause();
    }
  };

  _handleAnimation = () => {
    const { playOrPause } = this.state;

    playOrPause === 'play' ? this._handlePlay() : this._handlePause();
  };

  _handlePlay = () => {
    const { sliderDuration } = this.state;

    const intervalId = setInterval(this._animate, sliderDuration);
    this.setState({
      intervalSetter: intervalId,
      playOrPause: 'pause'
    });
  };

  _handlePause = () => {
    const { intervalSetter } = this.state;

    clearInterval(intervalSetter);
    this.setState({ isPlaying: false, playOrPause: 'play' });
  };

  _resetSlider = () => {
    const { maxValue } = this.state;

    this.setState({ value: 0 });
    this.props.animateMap([0, maxValue]);
  };

  _speed = type => {
    if (type === 'half') {
      this.setState(
        {
          sliderDuration: 400,
          halfSpeedEnabled: true,
          regularSpeedEnabled: false,
          doubleSpeedEnabled: false
        },
        () => {
          this._handlePause();
          this._handlePlay();
        }
      );
    } else if (type === 'regular') {
      this.setState(
        {
          sliderDuration: 200,
          halfSpeedEnabled: false,
          regularSpeedEnabled: true,
          doubleSpeedEnabled: false
        },
        () => {
          this._handlePause();
          this._handlePlay();
        }
      );
    } else if (type === 'double') {
      this.setState(
        {
          sliderDuration: 100,
          halfSpeedEnabled: false,
          regularSpeedEnabled: false,
          doubleSpeedEnabled: true
        },
        () => {
          this._handlePause();
          this._handlePlay();
        }
      );
    }
  };

  _containerVisibility = () => {
    const { hideContainer } = this.state;

    this.setState({
      hideContainer: hideContainer === 'time-slider--close' ? '' : 'time-slider--close'
    });
  };

  render() {
    const { classes } = this.props;
    const {
      memory,
      currentDay,
      hideContainer,
      value,
      maxValue,
      playOrPause,
      halfSpeedEnabled,
      regularSpeedEnabled,
      doubleSpeedEnabled,
      speedButtonActive
    } = this.state;
    return (
      <div className="time-slider">
        <div className="time-slider-button" onClick={this._containerVisibility}>
          <img src={iconImg} alt="Time-slider Widget icon" />
        </div>

        <div className={`time-slider-container ${hideContainer}`}>
          <div className="column">
            <div className="row time-slider-container-labels">
              <div>Reactive meteorites</div>
              <div className="speed-buttons">
                <div
                  className={halfSpeedEnabled ? speedButtonActive : ''}
                  onClick={() => this._speed('half')}
                >
                  0.5x
                </div>
                <div
                  className={regularSpeedEnabled ? speedButtonActive : ''}
                  onClick={() => this._speed('regular')}
                >
                  1x
                </div>
                <div
                  className={doubleSpeedEnabled ? speedButtonActive : ''}
                  onClick={() => this._speed('double')}
                >
                  2x
                </div>
              </div>
            </div>

            <div className="row">
              <div className="control-buttons row">
                <div className="button" onClick={this._resetSlider}>
                  <i className="icon undo" />
                </div>
                <div className="button" onClick={this._handleAnimation}>
                  <i className={`icon ${playOrPause}`} />
                </div>
              </div>

              <div className="slider column">
                <div className="bar-chart-container">
                  <BarChart memory={memory} />
                </div>
                <Slider
                  classes={{
                    root: classes.sliderRoot,
                    thumb: classes.sliderThumb
                  }}
                  value={value}
                  aria-labelledby="label"
                  onChange={this._handleSliderChange}
                  min={0}
                  max={maxValue}
                  step={1}
                  marks={true}
                />
                <div className="slider-labels-container">
                  {currentDay && currentDay.map((f, i) => <div key={`label-${i}`}>{f}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TemporalMapTimeSlider.propTypes = {
  classes: PropTypes.object.isRequired,
  memory: PropTypes.array.isRequired,
  dateUniques: PropTypes.array.isRequired,
  animateMap: PropTypes.func.isRequired
};

export default withStyles(styles)(TemporalMapTimeSlider);
