import React from 'react';
import PropTypes from 'prop-types';
import ChipsArray from './ChipsArray';

const ActiveFilters = props => {
  const { uriFilters, textFilters, facets } = props;
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
  return (
    <ChipsArray
      data={facetValues}
      facetClass={props.facetClass}
      updateFacetOption={props.updateFacetOption}
    />
  );
};

ActiveFilters.propTypes = {
  facets: PropTypes.object.isRequired,
  facetClass: PropTypes.string.isRequired,
  uriFilters: PropTypes.object.isRequired,
  spatialFilters: PropTypes.object.isRequired,
  textFilters: PropTypes.object.isRequired,
  updateFacetOption: PropTypes.func.isRequired
};

export default ActiveFilters;
