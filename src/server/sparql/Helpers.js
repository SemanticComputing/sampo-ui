import { facetConfigs } from './FacetConfigs';

export const generateFilter = (resultClass, filterTarget, filters) => {
  let filterStr = '';
  for (let property in filters) {
    filterStr += `
            VALUES ?${property}Filter { <${filters[property].join('> <')}> }
            ?${filterTarget} ${facetConfigs[resultClass][property].predicate} ?${property}Filter .
    `;
  }
  return filterStr;
};
