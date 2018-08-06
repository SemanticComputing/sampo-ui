import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';

let GMap = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={4}
    defaultCenter={{ lat: 65.184809, lng: 27.31405 }}
  >
    <HeatmapLayer data={
      props.results.reduce((data, obj) => {
        if (obj.hasOwnProperty('lat') && obj.hasOwnProperty('long')) {
          data.push(new google.maps.LatLng(obj.lat, obj.long));
        }
        return data;
      },[])
    } />
  </GoogleMap>
));

export default GMap;
