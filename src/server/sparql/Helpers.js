import { facetConfigs } from './FacetConfigs';

export const generateFilter = (resultClass, facetClass, filters, filterTarget) => {
  let filterStr = '';
  for (let property in filters) {
    filterStr += `
      VALUES ?${property}Filter { <${filters[property].join('> <')}> }
      ?${filterTarget} ${facetConfigs[facetClass][property].predicate} ?${property}Filter .
    `;
  }
  return filterStr;
};
