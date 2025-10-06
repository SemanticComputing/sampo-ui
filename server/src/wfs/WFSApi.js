import axios from 'axios'
import querystring from 'querystring'

// https://avaa.tdata.fi/web/paituli/rajapinta

export const fetchGeoJSONLayer = async ({ layerID, bounds = null }) => {
  // const baseUrl = 'http://kartta.nba.fi/arcgis/services/WFS/MV_Kulttuuriymparisto/MapServer/WFSServer'
  const baseUrl = 'http://avaa.tdata.fi/geoserver/kotus/ows'
  // const baseUrl = 'http://avaa.tdata.fi/geoserver/paituli/wfs'
  // const boundsStr =
  //   `${bounds._southWest.lng},${bounds._southWest.lat},${bounds._northEast.lng},${bounds._northEast.lat}`
  const mapServerParams = {
    request: 'GetFeature',
    service: 'WFS',
    version: '2.0.0',
    typeName: layerID,
    srsName: 'EPSG:4326',
    // outputFormat: 'geojson'
    outputFormat: 'application/json'
    // bbox: boundsStr
  }
  const url = `${baseUrl}?${querystring.stringify(mapServerParams)}`
  try {
    const response = await axios.get(url)
    return {
      layerID: layerID,
      geoJSON: response.data
    }
  } catch (error) {
    if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
      console.log(error.response.data)
    // console.log(error.response.status);
    // console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
    // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    console.log(error.config)
  }
}
