import React from 'react';
import PropTypes from 'prop-types';
import ChipsArray from './ChipsArray';

const ActiveFilters = props => {
  const { uriFilters, facets } = props;
  return (
    <React.Fragment>
      {Object.keys(uriFilters).map(facetID => {
        const facetValues = [];
        Object.entries(uriFilters[facetID]).forEach(([ key, value]) => {
          facetValues.push({
            facetID: facetID,
            facetLabel: facets[facetID].label,
            filterType: 'uriFilter',
            value: {
              id: key,
              label: value.length > 18 ? `${value.substring(0, 18)}...` : value,
            }
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
