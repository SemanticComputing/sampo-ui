import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import ResultTable from '../../facet_results/ResultTable'
import Export from '../../facet_results/Export'

const Perspective2 = props => {
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
      />
      <Route
        exact path='/perspective2/faceted-search'
        render={() => <Redirect to='/perspective2/faceted-search/table' />}
      />
      <Route
        path='/perspective2/faceted-search/table'
        render={routeProps =>
          <ResultTable
            data={props.perspective2}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='perspective2'
            facetClass='perspective2'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />}
      />
      <Route
        path='/perspective2/faceted-search/export'
        render={() =>
          <Export
            sparqlQuery={props.perspective2.paginatedResultsSparqlQuery}
            pageType='facetResults'
          />}
      />
    </>
  )
}

Perspective2.propTypes = {
  perspective2: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  facetData: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired,
  perspective: PropTypes.object.isRequired
}

export default Perspective2
