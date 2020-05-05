import React from 'react'
import PropTypes from 'prop-types'
import Perspective1 from './Perspective1'
import Perspective2 from './Perspective2'
import Perspective3 from './Perspective3'

const FacetedSearchPerspective = props => {
  const renderPerspective = () => {
    let perspectiveElement = null
    switch (props.perspective.id) {
      case 'perspective1':
        perspectiveElement =
          <Perspective1
            facetResults={props.facetResults}
            placesResults={props.placesResults}
            leafletMapLayers={props.leafletMap}
            facetData={props.facetData}
            fetchPaginatedResults={props.fetchPaginatedResults}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            updateFacetOption={props.updateFacetOption}
            sortResults={props.sortResults}
            routeProps={props.routeProps}
            perspective={props.perspective}
            animationValue={props.animationValue}
            animateMap={props.animateMap}
            screenSize={props.screenSize}
            rootUrl={props.rootUrl}
          />
        break
      case 'perspective2':
        perspectiveElement =
          <Perspective2
            facetResults={props.facetResults}
            placesResults={props.placesResults}
            leafletMapLayers={props.leafletMap}
            facetData={props.facetData}
            fetchPaginatedResults={props.fetchPaginatedResults}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            updateFacetOption={props.updateFacetOption}
            sortResults={props.sortResults}
            routeProps={props.routeProps}
            perspective={props.perspective}
            animationValue={props.animationValue}
            animateMap={props.animateMap}
            screenSize={props.screenSize}
            rootUrl={props.rootUrl}
          />
        break
      case 'perspective3':
        perspectiveElement =
          <Perspective3
            facetResults={props.facetResults}
            placesResults={props.placesResults}
            leafletMapLayers={props.leafletMap}
            facetData={props.facetData}
            fetchPaginatedResults={props.fetchPaginatedResults}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            updateFacetOption={props.updateFacetOption}
            sortResults={props.sortResults}
            routeProps={props.routeProps}
            perspective={props.perspective}
            animationValue={props.animationValue}
            animateMap={props.animateMap}
            screenSize={props.screenSize}
            rootUrl={props.rootUrl}
          />
        break
      default:
        perspectiveElement = <div />
        break
    }
    return perspectiveElement
  }
  return renderPerspective()
}

FacetedSearchPerspective.propTypes = {
  facetResults: PropTypes.object.isRequired,
  placesResults: PropTypes.object.isRequired,
  leafletMap: PropTypes.object.isRequired,
  facetData: PropTypes.object.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchGeoJSONLayers: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired,
  perspective: PropTypes.object.isRequired,
  animationValue: PropTypes.array.isRequired,
  animateMap: PropTypes.func.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default FacetedSearchPerspective
