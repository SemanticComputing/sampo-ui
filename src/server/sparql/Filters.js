import { facetConfigs } from './FacetConfigs';

export const generateFilter = (resultClass, facetClass, filters, filterTarget, facetID) => {
  let filterStr = '';
  let facetProperty = facetID !== null ? facetID : '';
  for (let property in filters) {
    if (property !== facetProperty) {
      filterStr += `
        VALUES ?${property}Filter { <${filters[property].join('> <')}> }
        ?${filterTarget} ${facetConfigs[facetClass][property].predicate} ?${property}Filter .
      `;
    }
  }
  return filterStr;
};
