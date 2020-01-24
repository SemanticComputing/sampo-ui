import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import ResultTable from '../../facet_results/ResultTable'
import Export from '../../facet_results/Export'
import ApexChart from '../../facet_results/ApexChart'
import LeafletMap from '../../facet_results/LeafletMap'

const Perspective3 = props => {
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
      />
      <Route
        exact path='/perspective3/faceted-search'
        render={() => <Redirect to='/perspective3/faceted-search/table' />}
      />
      <Route
        path='/perspective3/faceted-search/table'
        render={routeProps =>
          <ResultTable
            data={props.perspective3}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='perspective3'
            facetClass='perspective3'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />}
      />
      <Route
        path='/perspective3/faceted-search/map'
        render={() =>
          <LeafletMap
            results={props.places.results}
            pageType='facetResults'
            facetUpdateID={props.facetData.facetUpdateID}
            facet={props.facetData.facets.place}
            facetID='place'
            resultClass='placesEvents'
            facetClass='perspective3'
            mapMode='cluster'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
          />}
      />
      <Route
        path='/perspective3/faceted-search/by-period'
        render={() =>
          <ApexChart
            fetchResults={props.fetchResults}
            resultClass='perspective3ByTimePeriod'
            facetClass='perspective3'
            data={props.perspective3.results}
            fetching={props.perspective3.fetching}
            options={{
              chart: {
                type: 'bar',
                stacked: true,
                height: '100%',
                parentHeightOffset: 0,
                width: '100%'
              }
            }}
          />}
      />
      <Route
        path='/perspective3/faceted-search/export'
        render={() =>
          <Export
            sparqlQuery={props.perspective3.paginatedResultsSparqlQuery}
            pageType='facetResults'
          />}
      />
    </>
  )
}

Perspective3.propTypes = {
  perspective3: PropTypes.object.isRequired,
  places: PropTypes.object,
  facetData: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  perspective: PropTypes.object.isRequired
}

export default Perspective3
