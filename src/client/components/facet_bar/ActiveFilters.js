import React from 'react';
import PropTypes from 'prop-types';
import ChipsArray from './ChipsArray';

const ActiveFilters = props => {
  const { uriFilters, textFilters, timespanFilters, facets, someFacetIsFetching } = props;
  const facetValues = [];
  Object.keys(uriFilters).map(activeFacetID => {
    Object.values(uriFilters[activeFacetID]).forEach(value => {
      facetValues.push({
        facetID: activeFacetID,
        facetLabel: facets[activeFacetID].label,
        filterType: 'uriFilter',
        value: value // a react sortable tree object
      });
    });
  });
  Object.keys(textFilters).map(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: facets[facetID].label,
      filterType: 'textFilter',
      value: textFilters[facetID]
    });
  });
  Object.keys(timespanFilters).map(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: facets[facetID].label,
      filterType: 'timespanFilter',
      value: timespanFilters[facetID]
    });
  });
  return (
    <ChipsArray
      data={facetValues}
      facetClass={props.facetClass}
      updateFacetOption={props.updateFacetOption}
      someFacetIsFetching={someFacetIsFetching}
    />
  );
};

ActiveFilters.propTypes = {
  facets: PropTypes.object.isRequired,
  facetClass: PropTypes.string.isRequired,
  uriFilters: PropTypes.object.isRequired,
  spatialFilters: PropTypes.object.isRequired,
  textFilters: PropTypes.object.isRequired,
  timespanFilters: PropTypes.object.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  someFacetIsFetching: PropTypes.bool.isRequired
};

export default ActiveFilters;
