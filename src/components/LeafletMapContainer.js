import React from 'react';
import LeafletMap from './LeafletMap';

class LeafletMapContainer extends React.Component {

  updateDimensions() {
    let height = window.innerWidth >= 992 ? window.innerHeight : 400;
    height = height - 64;
    this.setState({ height: height });
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  render() {
    return (
      <div className="map-container" style={{ height: this.state.height }}>
        <LeafletMap />
      </div>
    );
  }
}

export default LeafletMapContainer;
