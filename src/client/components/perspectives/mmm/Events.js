import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import ResultTable from '../../facet_results/ResultTable'
import Export from '../../facet_results/Export'
import ApexChart from '../../facet_results/ApexChart'
import LeafletMap from '../../facet_results/LeafletMap'

const Events = props => {
  // console.log(props.events.results)
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
      />
      <Route
        exact path='/events/faceted-search'
        render={() => <Redirect to='/events/faceted-search/table' />}
      />
      <Route
        path='/events/faceted-search/table'
        render={routeProps =>
          <ResultTable
            data={props.events}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='events'
            facetClass='events'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />}
      />
      <Route
        path='/events/faceted-search/map'
        render={() =>
          <LeafletMap
            results={props.places.results}
            pageType='facetResults'
            facetUpdateID={props.facetData.facetUpdateID}
            facet={props.facetData.facets.place}
            facetID='place'
            resultClass='placesEvents'
            facetClass='events'
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
        path='/events/faceted-search/by-period'
        render={() =>
          <ApexChart
            fetchResults={props.fetchResults}
            resultClass='eventsByTimePeriod'
            facetClass='events'
            data={props.events.results}
            fetching={props.events.fetching}
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
        path='/events/faceted-search/export'
        render={() =>
          <Export
            sparqlQuery={props.events.paginatedResultsSparqlQuery}
            pageType='facetResults'
          />}
      />
    </>
  )
}

Events.propTypes = {
  events: PropTypes.object.isRequired,
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

export default Events
