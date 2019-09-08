import querystring from 'querystring';
import { has } from 'lodash';

export const stateToUrl = ({
  facets,
  facetClass = null,
  page = null,
  pagesize = null,
  sortBy = null,
  sortDirection = null,
  resultFormat = null
}) => {
  let params = {};
  if (facetClass !== null) { params.facetClass = facetClass; }
  if (page !== null) { params.page = page; }
  if (pagesize !== null) { params.pagesize = pagesize; }
  if (sortBy !== null) { params.sortBy = sortBy; }
  if (sortDirection !== null) { params.sortDirection = sortDirection; }
  if (resultFormat !== null) { params.resultFormat = resultFormat; }
  if (facets !== null) {
    let constraints = {};
    for (const [key, value] of Object.entries(facets)) {
      if (has(value, 'uriFilter') && value.uriFilter !== null) {
        constraints[key] = {
          filterType: value.filterType,
          priority: value.priority,
          values: Object.keys(value.uriFilter)
        };
      } else if (has(value, 'spatialFilter') && value.spatialFilter !== null) {
        constraints[key] = {
          filterType: value.filterType,
          priority: value.priority,
          values: boundsToValues(value.spatialFilter._bounds)
        };
      }  else if (has(value, 'textFilter') && value.textFilter !== null) {
        constraints[key] = {
          filterType: value.filterType,
          priority: value.priority,
          values: value.textFilter
        };
      } else if (has(value, 'timespanFilter') && value.timespanFilter !== null) {
        constraints[key] = {
          filterType: value.filterType,
          priority: value.priority,
          values: value.timespanFilter
        };
      } else if (has(value, 'integerFilter') && value.integerFilter !== null) {
        constraints[key] = {
          filterType: value.filterType,
          priority: value.priority,
          values: value.integerFilter
        };
      }
    }
    if (Object.keys(constraints).length > 0) {
      params.constraints = JSON.stringify(constraints);
    }
  }
  return querystring.stringify(params);
};

export const urlToState = ({ initialState, queryString }) => {
  const params = querystring.parse(queryString);
  return params;
};

const boundsToValues = bounds => {
  const latMin = bounds._southWest.lat;
  const longMin = bounds._southWest.lng;
  const latMax = bounds._northEast.lat;
  const longMax = bounds._northEast.lng;
  return {
    latMin: latMin,
    longMin: longMin,
    latMax: latMax,
    longMax: longMax,
  };
};
