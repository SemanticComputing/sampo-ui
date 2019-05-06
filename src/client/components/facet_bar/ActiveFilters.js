import React from 'react';
import PropTypes from 'prop-types';
import ChipsArray from './ChipsArray';

const ActiveFilters = props => {
  const { uriFilters, facets } = props;
  return (
    <React.Fragment>
      {Object.keys(uriFilters).map(facetID => {
        const facetValues = [];
        Object.values(uriFilters[facetID]).forEach(value => {
          facetValues.push({
            facetID: facetID,
            facetLabel: facets[facetID].label,
            filterType: 'uriFilter',
            value: value // a react sortable tree object
          });
        });
        return (
          <ChipsArray
            key={facetID}
            data={facetValues}
            facetClass={props.facetClass}
            updateFacetOption={props.updateFacetOption}
          />
        );
      })}
    </React.Fragment>
  );
};

ActiveFilters.propTypes = {
  facets: PropTypes.object.isRequired,
  facetClass: PropTypes.string.isRequired,
  uriFilters: PropTypes.object.isRequired,
  spatialFilters: PropTypes.object.isRequired,
  updateFacetOption: PropTypes.func.isRequired
};

export default ActiveFilters;
