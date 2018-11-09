import React from 'react';
import PropTypes from 'prop-types';
import ResultTable from './ResultTable';

let Manuscripts = props => {

  return (
    <ResultTable
      rows={props.search.manuscripts}
      facet={props.facet}
      fetchManuscripts={props.fetchManuscripts}
      fetchingManuscripts={props.search.fetchingManuscripts}
      fetchFacet={props.fetchFacet}
      results={props.search.results}
      fetchResults={props.fetchResults}
      page={props.search.page}
    />
  );
};

Manuscripts.propTypes = {
  facet: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired
};

export default Manuscripts;
