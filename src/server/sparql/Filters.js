import { facetConfigs } from './FacetConfigs';

export const hasPreviousSelections = (constraints, facetID) => {
  let hasPreviousSelections = false;
  for (const [key, value] of Object.entries(constraints)) {
    if (key === facetID && value.filterType === 'uriFilter') {
      hasPreviousSelections = true;
    }
  }
  return hasPreviousSelections;
};

export const hasPreviousSelectionsFromOtherFacets = (constraints, facetID) => {
  for (const [key, value] of Object.entries(constraints)) {
    if (key !== facetID && value.filterType === 'uriFilter') {
      return true;
    }
  }
  return false;
};

export const getUriFilters = (constraints, facetID) => {
  for (const [key, value] of Object.entries(constraints)) {
    if (key === facetID && value.filterType === 'uriFilter') {
      return value.values;
    }
  }
  return [];
};

export const generateConstraintsBlock = ({
  facetClass,
  constraints,
  filterTarget,
  facetID,
  inverse,
}) => {
  //delete constraints[facetID];
  let filterStr = '';
  let constraintsArr = [];
  for (const [key, value] of Object.entries(constraints)) {
    if (key !== facetID) { // use only constraints from other facets
      constraintsArr.push({
        id: key,
        filterType: value.filterType,
        priority: value.priority,
        values: value.values,
      });
    }
  }
  constraintsArr.sort((a, b) => a.priority - b.priority);
  constraintsArr.map(c => {
    switch (c.filterType) {
      case 'textFilter':
        filterStr += generateTextFilter({
          facetClass: facetClass,
          facetID: c.id,
          filterTarget: filterTarget,
          queryString: c.values
        });
        break;
      case 'uriFilter':
        filterStr += generateUriFilter({
          facetClass: facetClass,
          facetID: c.id,
          filterTarget: filterTarget,
          values: c.values,
          inverse: inverse
        });
        break;
      case 'spatialFilter':
        filterStr += generateSpatialFilter({
          facetClass: facetClass,
          facetID: c.id,
          filterTarget: filterTarget,
          values: c.values,
        });
        break;
      case 'timespanFilter':
        filterStr += generateTimespanFilter({
          facetClass: facetClass,
          facetID: c.id,
          filterTarget: filterTarget,
          values: c.values,
        });
        break;
    }
  });
  return filterStr;
};

const generateTextFilter = ({
  facetClass,
  facetID,
  filterTarget,
  queryString
}) => {
  return `?${filterTarget} text:query (${facetConfigs[facetClass][facetID].textQueryProperty} '${queryString}') . `;
};

const generateSpatialFilter = ({
  facetClass,
  facetID,
  filterTarget,
  values
}) => {
  const { latMin, longMin, latMax, longMax } = values;
  return `
    ?${facetID}Filter spatial:withinBox (${latMin} ${longMin} ${latMax} ${longMax} 1000000) .
    ?${filterTarget} ${facetConfigs[facetClass][facetID].predicate} ?${facetID}Filter .
  `;
};

const generateTimespanFilter = ({
  facetClass,
  facetID,
  filterTarget,
  values
}) => {
  const facetConfig = facetConfigs[facetClass][facetID];
  const { start, end } = values;
  const selectionStart = start;
  const selectionEnd = end;
  // return `
  //   ?${filterTarget} ${facetConfig.predicate} ?timespan .
  //   ?timespan ${facetConfig.startProperty} ?start .
  //   ?timespan ${facetConfig.endProperty} ?end .
  //   # both start and end is in selected range
  //   FILTER(?start >= "${start}"^^xsd:date)
  //   FILTER(?end <= "${end}"^^xsd:date)
  // `;
  return `
    ?${filterTarget} ${facetConfig.predicate} ?${facetID} .
    ?${facetID} ${facetConfig.startProperty} ?${facetID}Start .
    ?${facetID} ${facetConfig.endProperty} ?${facetID}End .
    # either start or end is in selected range
    FILTER(
      ?${facetID}Start >= "${selectionStart}"^^xsd:date && ?${facetID}Start <= "${selectionEnd}"^^xsd:date
      ||
      ?${facetID}End >= "${selectionStart}"^^xsd:date && ?${facetID}End <= "${selectionEnd}"^^xsd:date
    )
  `;
};

const generateUriFilter = ({
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  let s = '';
  let addChildren = facetConfigs[facetClass][facetID].type == 'hierarchical';
  if (addChildren) {
    s = `
         VALUES ?${facetID}Filter { <${values.join('> <')}> }
         ?${facetID}FilterWithChildren gvp:broaderPreferred* ?${facetID}Filter .
     `;
  } else {
    s = `
         VALUES ?${facetID}Filter { <${values.join('> <')}> }
     `;
  }
  if (inverse) {
    s += `
       FILTER NOT EXISTS {
         ?${filterTarget} ${facetConfigs[facetClass][facetID].predicate} ?${facetID}Filter .
         ?${filterTarget} ${facetConfigs[facetClass][facetID].predicate} ?id .
       }
     `;
  } else {
    const filterValue = addChildren
      ? `?${facetID}FilterWithChildren`
      : `?${facetID}Filter`;
    s += `
       ?${filterTarget} ${facetConfigs[facetClass][facetID].predicate} ${filterValue} .
     `;
  }
  return s;
};

export const generateSelectedFilter = ({
  facetID,
  constraints,
  inverse
}) => {
  return (`
      FILTER(?id ${inverse ? 'NOT' : ''} IN ( <${getUriFilters(constraints, facetID).join('>, <')}> ))
  `);
};
