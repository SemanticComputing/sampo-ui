import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import ChipsArray from './ChipsArray';

const ActiveFilters = props => {
  const { uriFilters, textFilters, timespanFilters, integerFilters, facetClass, someFacetIsFetching } = props;
  const facetValues = [];
  Object.keys(uriFilters).map(activeFacetID => {
    // URI filter may have multiple values
    Object.values(uriFilters[activeFacetID]).forEach(value => {
      facetValues.push({
        facetID: activeFacetID,
        facetLabel: intl.get(`perspectives.${facetClass}.properties.${activeFacetID}.label`),
        filterType: 'uriFilter',
        value: value // a react sortable tree object
      });
    });
  });
  Object.keys(textFilters).map(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: intl.get(`perspectives.${facetClass}.properties.${facetID}.label`),
      filterType: 'textFilter',
      value: textFilters[facetID]
    });
  });
  Object.keys(timespanFilters).map(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: intl.get(`perspectives.${facetClass}.properties.${facetID}.label`),
      filterType: 'timespanFilter',
      value: timespanFilters[facetID]
    });
  });
  Object.keys(integerFilters).map(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: intl.get(`perspectives.${facetClass}.properties.${facetID}.label`),
      filterType: 'integerFilter',
      value: integerFilters[facetID]
    });
  });
  return (
    <ChipsArray
      data={facetValues}
      facetClass={props.facetClass}
      updateFacetOption={props.updateFacetOption}
      someFacetIsFetching={someFacetIsFetching}
      fetchFacet={props.fetchFacet}
    />
  );
};

ActiveFilters.propTypes = {
  facetClass: PropTypes.string.isRequired,
  uriFilters: PropTypes.object.isRequired,
  spatialFilters: PropTypes.object.isRequired,
  textFilters: PropTypes.object.isRequired,
  timespanFilters: PropTypes.object.isRequired,
  integerFilters: PropTypes.object.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  someFacetIsFetching: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func.isRequired
};

export default ActiveFilters;
