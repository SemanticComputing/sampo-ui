import { has } from 'lodash';
import { runSelectQuery } from './SparqlApi';
import {
  endpoint,
  facetValuesQuery,
  facetValuesQueryTimespan
} from './SparqlQueriesGeneral';
import { prefixes } from './SparqlQueriesPrefixes';
import { facetConfigs } from './FacetConfigs';
import { generateFilter, generateSelectedFilter } from './Filters';
import {
  mapFacet,
  mapHierarchicalFacet,
} from './Mappers';

export const getFacet = ({
  facetClass,
  facetID,
  sortBy,
  sortDirection,
  uriFilters,
  spatialFilters,
  textFilters
}) => {
  const facetConfig = facetConfigs[facetClass][facetID];
  // choose a query template:
  let q = '';
  switch(facetConfig.type) {
    case 'list':
    case 'hierarchical':
      q = facetValuesQuery;
      break;
    case 'timespan':
      q = facetValuesQueryTimespan;
      break;
    default:
      q = facetValuesQuery;
  }
  let selectedBlock = '# no selections';
  let selectedNoHitsBlock = '# no filters from other facets';
  let filterBlock = '# no filters';
  let parentBlock = '# no parents';
  let mapper = mapFacet;
  const hasFilters = uriFilters !== null
    || spatialFilters !== null
    || textFilters !== null;
  if (hasFilters) {
    filterBlock = generateFilter({
      facetClass: facetClass,
      uriFilters: uriFilters,
      spatialFilters: spatialFilters,
      textFilters: textFilters,
      filterTarget: 'instance',
      facetID: facetID,
      inverse: false,
    });
  }
  // if this facet has previous selections, include them in the query
  if (uriFilters !== null && has(uriFilters, facetID)) {
    selectedBlock = generateSelectedBlock({
      facetID,
      uriFilters
    });
    selectedNoHitsBlock = generateSelectedNoHitsBlock({
      facetClass,
      facetID,
      uriFilters,
      spatialFilters,
      textFilters
    });
  }
  if (facetConfig.type === 'hierarchical') {
    mapper = mapHierarchicalFacet;
    const { parentPredicate } = facetConfig;
    parentBlock = generateParentBlock({
      facetClass,
      facetID,
      uriFilters,
      spatialFilters,
      textFilters,
      parentPredicate
    });
  }
  q = q.replace('<SELECTED_VALUES>', selectedBlock);
  q = q.replace('<SELECTED_VALUES_NO_HITS>', selectedNoHitsBlock);
  q = q.replace('<FACET_VALUE_FILTER>', facetConfig.facetValueFilter);
  q = q.replace('<PARENTS>', parentBlock);
  q = q.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})` );
  q = q.replace(/<FACET_CLASS>/g, facetConfigs[facetClass].facetClass);
  q = q.replace(/<FILTER>/g, filterBlock );
  q = q.replace(/<PREDICATE>/g, facetConfig.predicate);
  return runSelectQuery(prefixes + q, endpoint, mapper);
};

const generateSelectedBlock = ({
  facetID,
  uriFilters,
}) => {
  const selectedFilter = generateSelectedFilter({
    selectedValues: uriFilters[facetID],
    inverse: false
  });
  return `
          OPTIONAL {
            ${selectedFilter}
            BIND(true AS ?selected_)
          }
  `;
};

const generateSelectedNoHitsBlock = ({
  facetClass,
  facetID,
  uriFilters,
  spatialFilters,
  textFilters
}) => {
  const facetIDs = Object.keys(uriFilters);
  // get selected values with no hits, only when there are filters from
  // other facets
  if (facetIDs.length > 1) {
    const noHitsFilter = generateFilter({
      facetClass: facetClass,
      uriFilters: uriFilters,
      spatialFilters: spatialFilters,
      textFilters: textFilters,
      filterTarget: 'instance',
      facetID: facetID,
      inverse: true,
    });
    return `
  UNION
  {
  # facet values that have been selected but return no results
    VALUES ?id { <${uriFilters[facetID].join('> <')}> }
    ${noHitsFilter}
    BIND(true AS ?selected_)
  }
    `;
  }
};

const generateParentBlock = ({
  facetClass,
  facetID,
  uriFilters,
  spatialFilters,
  textFilters,
  parentPredicate
}) => {
  const parentFilterStr = generateFilter({
    facetClass: facetClass,
    uriFilters: uriFilters,
    spatialFilters: spatialFilters,
    textFilters: textFilters,
    filterTarget: 'instance2',
    facetID: facetID,
    inverse: false
  });
  let ignoreSelectedValues = '';
  if (uriFilters !== null && has(uriFilters, facetID)) {
    ignoreSelectedValues = generateSelectedFilter({
      selectedValues:uriFilters[facetID],
      inverse: true
    });
  }
  return `
        UNION
        # parents for all facet values
        {
          ${parentFilterStr}
          # these instances should not be counted, so use another variable name
          ?instance2 ${parentPredicate} ?id .
          VALUES ?facetClass { <FACET_CLASS> }
          ?instance2 a ?facetClass .
          BIND(false AS ?selected_)
          ${ignoreSelectedValues}
        }
    `;
};
