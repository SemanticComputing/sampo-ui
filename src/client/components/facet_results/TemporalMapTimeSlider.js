import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Slider from '@material-ui/core/Slider'
import { SLIDER_DURATION } from '../../configs/sampo/GeneralConfig'
import { BaseControl } from 'react-map-gl'
import moment from 'moment'
// import iconImg from './icon.png';
// import BarChart from './TemporalMapBarChart';

const blue = 'rgb(0, 126, 230)'
const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'

const styles = () => ({
  sliderRoot: {
    color: blue,
    width: '98%',
    marginTop: 35
  },
  sliderTrack: {
    height: 8
  },
  sliderRail: {
    height: 8
  },
  sliderThumb: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -12,
    marginLeft: -14,
    '&:focus,&:hover,&$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow
      }
    }
  },
  sliderValueLabel: {
    left: 'calc(-50% + 12px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#fff'
    }
  }
})

// https://uber.github.io/react-map-gl/#/Documentation/advanced/custom-components
class TemporalMapTimeSlider extends BaseControl {
  state = {
    memory: [],
    currentDay: null,
    hideContainer: '',
    value: 0,
    sliderDuration: SLIDER_DURATION.normalSpeed,
    intervalSetter: null,
    isPlaying: false,
    playOrPause: 'play',
    speedButtonActive: 'time-slider-speed-button--active',
    halfSpeedEnabled: false,
    regularSpeedEnabled: true,
    doubleSpeedEnabled: false
  };

  componentWillUnmount () {
    clearInterval(this.state.intervalSetter)
  }

  componentDidUpdate = prevProps => {
    if (prevProps.memory !== this.props.memory) {
      this.setState({ memory: this.props.memory })
    }

    if (prevProps.dates !== this.props.dates) {
      this.setState({
        maxValue: this.props.dates.length - 1,
        value: this.props.initialValue
      })
    }
  };

  handleSliderChange = (event, newValue) => {
    const { maxValue } = this.state
    this.setState({ value: newValue })
    this.props.animateMap([newValue, maxValue])
  };

  _animate = () => {
    const { value, maxValue } = this.state

    if (value <= maxValue) {
      this.setState(
        {
          value: parseInt(value) + 1,
          isPlaying: true
        },
        () => {
          this.props.animateMap([value, maxValue])
        }
      )
    }

    if (value === maxValue) {
      this.handlePause()
    }
  };

  handleAnimation = () => {
    const { playOrPause } = this.state

    playOrPause === 'play' ? this.handlePlay() : this.handlePause()
  };

  handlePlay = () => {
    const { sliderDuration } = this.state

    const intervalId = setInterval(this._animate, sliderDuration)
    this.setState({
      intervalSetter: intervalId,
      playOrPause: 'pause'
    })
  };

  handlePause = () => {
    const { intervalSetter } = this.state

    clearInterval(intervalSetter)
    this.setState({ isPlaying: false, playOrPause: 'play' })
  };

  handleResetSlider = () => {
    const { maxValue } = this.state

    this.setState({ value: 0 })
    this.props.animateMap([0, maxValue])
  };

  _speed = type => {
    if (type === 'half') {
      this.setState(
        {
          sliderDuration: SLIDER_DURATION.halfSpeed,
          halfSpeedEnabled: true,
          regularSpeedEnabled: false,
          doubleSpeedEnabled: false
        },
        () => {
          this.handlePause()
          this.handlePlay()
        }
      )
    } else if (type === 'regular') {
      this.setState(
        {
          sliderDuration: SLIDER_DURATION.normalSpeed,
          halfSpeedEnabled: false,
          regularSpeedEnabled: true,
          doubleSpeedEnabled: false
        },
        () => {
          this.handlePause()
          this.handlePlay()
        }
      )
    } else if (type === 'double') {
      this.setState(
        {
          sliderDuration: SLIDER_DURATION.doubleSpeed,
          halfSpeedEnabled: false,
          regularSpeedEnabled: false,
          doubleSpeedEnabled: true
        },
        () => {
          this.handlePause()
          this.handlePlay()
        }
      )
    }
  };

  _containerVisibility = () => {
    const { hideContainer } = this.state

    this.setState({
      hideContainer: hideContainer === 'time-slider--close' ? '' : 'time-slider--close'
    })
  };

  _sliderValueText = value => {
    const isoDate = this.props.dates[value]
    return moment(isoDate).format('DD.MM.YYYY')
  }

  _render () {
    const { classes } = this.props
    const {
      // memory,
      // currentDay,
      hideContainer,
      value,
      maxValue,
      playOrPause,
      halfSpeedEnabled,
      regularSpeedEnabled,
      doubleSpeedEnabled,
      speedButtonActive
    } = this.state

    // console.log(this.props.mapElementRef.current);

    return (
      <div ref={this._containerRef} className='time-slider'>
        {/* <div className="time-slider-button" onClick={this._containerVisibility}>
          <img src={iconImg} alt="Time-slider Widget icon" />
        </div> */}

        <div className={`time-slider-container ${hideContainer}`}>
          <div className='column'>
            <div className='row time-slider-container-labels'>
              <div className='speed-buttons'>
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

            <div className='row'>
              <div className='control-buttons row'>
                <div className='button' onClick={this.handleResetSlider}>
                  <i className='icon undo' />
                </div>
                <div className='button' onClick={this.handleAnimation}>
                  <i className={`icon ${playOrPause}`} />
                </div>
              </div>

              <div className='slider column'>
                {/* <div className="bar-chart-container">
                  <BarChart memory={memory} />
                </div> */}
                <Slider
                  classes={{
                    root: classes.sliderRoot,
                    thumb: classes.sliderThumb,
                    valueLabel: classes.sliderValueLabel,
                    track: classes.sliderTrack,
                    rail: classes.sliderRail
                  }}
                  value={value}
                  aria-labelledby='label'
                  onChange={this.handleSliderChange}
                  min={0}
                  max={maxValue}
                  step={1}
                  valueLabelDisplay='on'
                  valueLabelFormat={this._sliderValueText}
                />
                {/*
                <div className="slider-labels-container">
                  {currentDay && currentDay.map((f, i) => <div key={`label-${i}`}>{f}</div>)}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TemporalMapTimeSlider.propTypes = {
  classes: PropTypes.object.isRequired,
  memory: PropTypes.array.isRequired,
  dates: PropTypes.array.isRequired,
  animateMap: PropTypes.func.isRequired,
  initialValue: PropTypes.number.isRequired
}

export default withStyles(styles)(TemporalMapTimeSlider)
