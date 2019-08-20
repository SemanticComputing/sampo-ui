import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
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
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

class SliderFacet extends Component {

  componentDidMount = () => {
    this.props.fetchFacet({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
    });
  }

  handleSliderOnChange = values => {
    console.log(values)
    if (this.props.dataType === 'ISOString') {
      values[0] = this.YearToISOString({ year: values[0], start: true });
      values[1] = this.YearToISOString({ year: values[1], start: false });
    }
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: this.props.facet.filterType,
      value: values
    });
  }

  ISOStringToYear = str => {
    let year = null;
    if (str.charAt(0) == '-') {
      year = parseInt(str.substring(0,5));
    } else {
      year = parseInt(str.substring(0,4));
    }
    return year;
  }

  YearToISOString = ({ year, start }) => {
    const abs = Math.abs(year);
    let s = year.toString();
    let negative = false;
    if (s.charAt(0) == '-') {
      s = s.substring(1);
      negative = true;
    }
    if (abs < 10) {
      s = '000' + s;
    }
    if (abs >= 10 && abs < 100) {
      s = '00' + s;
    }
    if (abs >= 100 && abs < 1000) {
      s = '0' + s;
      s = negative ? s = '-' + s : s;
    }
    s = start ? s + '-01-01' :  s + '-12-31';
    return s;
  }

  render() {
    const { classes, someFacetIsFetching } = this.props;
    const { isFetching, min, max } = this.props.facet;
    let domain = null;
    if (isFetching || min == null || max == null) {
      return(
        <div className={classes.spinnerContainer}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </div>
      );
    } else {
      if (this.props.dataType === 'ISOString') {
        const minYear = this.ISOStringToYear(min);
        const maxYear = this.ISOStringToYear(max);
        domain = [ minYear, maxYear ]; // use as default values
      } else if (this.props.dataType === 'integer') {
        domain = [ min, max ];
        // domain = [ 0, 10000 ];
      }
      // Slider documentation: https://github.com/sghall/react-compound-slider
      return (
        <div className={classes.root}>
          <Slider
            mode={1}
            step={1}
            domain={domain}
            disabled={someFacetIsFetching}
            reversed={false}
            rootStyle={sliderRootStyle}
            onChange={this.handleSliderOnChange}
            values={domain}
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
}


SliderFacet.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.object.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func,
  facetUpdateID: PropTypes.number,
  updatedFilter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  updatedFacet: PropTypes.string,
  dataType: PropTypes.string.isRequired
};

export default withStyles(styles)(SliderFacet);
