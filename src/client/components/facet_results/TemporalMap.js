import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL from 'react-map-gl';
import axios from 'axios';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import TemporalMapTimeSlider from './TemporalMapTimeSlider';
import * as config from '../../configs/mmm/TemporalMapConfig';
import './TemporalMapCommon.scss';

const styles = theme => ({
  root: {
    height: 400,
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 72px)'
    },
    position: 'relative'
  },
});

// based on https://github.com/AdriSolid/DECK.GL-Time-Slider
class TemporalMap extends Component {
  state = {
    basemap: config.basemap,
    viewState: config.VIEWSTATE,
    data: [],
    memory: [],
    uniques_date: []
  };

  componentDidMount() {
    axios
      .get(config.DATA)
      .then(response => {
        const target = response.data.sort((a, b) => a[config.DATE_FIELD] - b[config.DATE_FIELD]);
        const date = target
          .map(item => item[config.DATE_FIELD])
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort();
        this.setState({
          data: target,
          memory: target,
          uniques_date: date
        });
      })
      .catch(err => {
        throw err;
      });
  }

  componentDidUpdate = prevProps => {
    const { memory } = this.state;
    if (prevProps.animationValue !== this.props.animationValue) {
      const sliderValue = this.props.animationValue;
      const total = memory.length;
      const featuresPerInterval = total / sliderValue[1];
      const toShow = sliderValue[0] * featuresPerInterval;
      const newData = memory.filter((f, i) => i < toShow);
      this.setState({
        data: newData
      });
    }
  };

  _onViewStateChange = ({ viewState }) => {
    this.setState({ viewState });
  };

  _renderMassTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};

    return (
      hoveredObject && (
        <div className="tooltip" style={{ left: pointerX, top: pointerY }}>
          <div>
            <b>{hoveredObject[config.NAME_FIELD]}</b>
          </div>
          <div>
            mass:<b>{hoveredObject[config.MASS_FIELD]}</b>
          </div>
        </div>
      )
    );
  }

  _renderLayers() {
    const { viewState, data } = this.state;

    return [
      new ScatterplotLayer({
        id: 'meteorites-layer',
        data: data,
        pickable: true,
        getPosition: d => d.coordinates,
        getRadius: d => {
          if (d[config.MASS_FIELD] < config.SIZE.SMALL) {
            return 1;
          } else if (d[config.MASS_FIELD] < config.SIZE.MEDIUM) {
            return 2;
          } else if (d[config.MASS_FIELD] < config.SIZE.BIG) {
            return 3;
          } else {
            return 5;
          }
        },
        getFillColor: d => {
          if (d[config.MASS_FIELD] < config.SIZE.SMALL) {
            return config.MASS_COLORS[0];
          } else if (d[config.MASS_FIELD] < config.SIZE.MEDIUM) {
            return config.MASS_COLORS[1];
          } else if (d[config.MASS_FIELD] < config.SIZE.BIG) {
            return config.MASS_COLORS[2];
          } else {
            return config.MASS_COLORS[3];
          }
        },
        radiusScale: () => 2 ** (18 - viewState.zoom),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          })
      })
    ];
  }

  render() {
    const { viewState, memory, uniques_date } = this.state;
    const { controller = true, baseMap = true, classes, animateMap } = this.props;

    return (
      <div className={classes.root}>
        <DeckGL
          width={'100%'}
          height={'100%'}
          layers={this._renderLayers()}
          viewState={viewState}
          controller={controller}
          onViewStateChange={this._onViewStateChange}
        >
          {baseMap &&
            <ReactMapGL
              reuseMaps
              mapStyle={config.basemap}
              preventStyleDiffing={true}
              doubleClickZoom={false}
              mapboxApiAccessToken={config.MAPBOX_TOKEN}
            />
          }
        </DeckGL>
        {this._renderMassTooltip()}
        <TemporalMapTimeSlider
          memory={memory}
          dateUniques={uniques_date}
          animateMap={animateMap}
        />
      </div>
    );
  }
}

TemporalMap.propTypes = {
  classes: PropTypes.object.isRequired,
  animationValue: PropTypes.array.isRequired,
  controller: PropTypes.bool,
  baseMap: PropTypes.bool,
  animateMap: PropTypes.func.isRequired
};

export default withStyles(styles)(TemporalMap);
