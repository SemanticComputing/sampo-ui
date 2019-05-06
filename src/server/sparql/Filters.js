import { facetConfigs } from './FacetConfigs';

export const generateFilter = ({
  facetClass,
  uriFilters,
  spatialFilters,
  filterTarget,
  facetID
}) => {
  let filterStr = '';
  let facetProperty = facetID !== null ? facetID : '';
  if (uriFilters !== null) {
    for (let property in uriFilters) {
      // when filtering facet values, apply filters only from other facets
      if (property !== facetProperty) {
        filterStr += `
            VALUES ?${property}Filter { <${uriFilters[property].join('> <')}> }
            ?${filterTarget} ${facetConfigs[facetClass][property].predicate} ?${property}Filter .
        `;
      }
    }
  }
  if (spatialFilters !== null) {
    for (let property in spatialFilters) {
      if (property !== facetProperty) {
        const { latMin, longMin, latMax, longMax } = spatialFilters[property];
        filterStr += `
          ?${property}Filter spatial:withinBox (${latMin} ${longMin} ${latMax} ${longMax} 1000000) .
          ?${filterTarget} ${facetConfigs[facetClass][property].predicate} ?${property}Filter .
        `;
      }
    }
  }
  return filterStr;
};
