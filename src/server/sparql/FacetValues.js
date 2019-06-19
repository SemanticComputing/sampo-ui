import { has } from 'lodash';
import { runSelectQuery } from './SparqlApi';
import {
  endpoint,
  facetValuesQuery,
  facetValuesQueryTimespan
} from './SparqlQueriesGeneral';
import { prefixes } from './SparqlQueriesPrefixes';
import { facetConfigs } from './FacetConfigs';
import {
  hasFilters,
  generateFilter,
  generateSelectedFilter
} from './Filters';
import {
  mapFacet,
  mapHierarchicalFacet,
  mapTimespanFacet
} from './Mappers';

export const getFacet = ({
  facetClass,
  facetID,
  sortBy,
  sortDirection,
  uriFilters,
  spatialFilters,
  textFilters,
  timespanFilters,
}) => {
  const facetConfig = facetConfigs[facetClass][facetID];
  // choose query template and result mapper:
  let q = '';
  let mapper = null;
  switch(facetConfig.type) {
    case 'list':
      q = facetValuesQuery;
      mapper = mapFacet;
      break;
    case 'hierarchical':
      q = facetValuesQuery;
      mapper = mapHierarchicalFacet;
      break;
    case 'timespan':
      q = facetValuesQueryTimespan;
      mapper = mapTimespanFacet;
      break;
    default:
      q = facetValuesQuery;
      mapper = mapFacet;
  }
  let selectedBlock = '# no selections';
  let selectedNoHitsBlock = '# no filters from other facets';
  let filterBlock = '# no filters';
  let parentBlock = '# no parents';
  const hasActiveFilters = hasFilters({
    uriFilters,
    spatialFilters,
    textFilters,
    timespanFilters,
  });
  if (hasActiveFilters) {
    filterBlock = generateFilter({
      facetClass: facetClass,
      uriFilters: uriFilters,
      spatialFilters: spatialFilters,
      textFilters: textFilters,
      timespanFilters: timespanFilters,
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
    /*
      if there are also filters from other facets, we need this
      additional block for facet values that return 0 hits
    */
    if (Object.keys(uriFilters).length > 1) {
      selectedNoHitsBlock = generateSelectedNoHitsBlock({
        facetClass,
        facetID,
        uriFilters,
        spatialFilters,
        textFilters
      });
    }
  }
  if (facetConfig.type === 'hierarchical') {
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
  if (facetConfig.type === 'list') {
    q = q.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})` );
  } else {
    q = q.replace('<ORDER_BY>', '# no need for ordering');
  }
  q = q.replace(/<FACET_CLASS>/g, facetConfigs[facetClass].facetClass);
  q = q.replace(/<FILTER>/g, filterBlock );
  q = q.replace(/<PREDICATE>/g, facetConfig.predicate);
  if (facetConfig.type === 'timespan') {
    q = q.replace('<START_PROPERTY>', facetConfig.startProperty);
    q = q.replace('<END_PROPERTY>', facetConfig.endProperty);
  }
  // if (facetID == 'productionPlace') {
  //   console.log(prefixes + q)
  // }
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
  textFilters,
  timespanFilters,
}) => {
  const noHitsFilter = generateFilter({
    facetClass: facetClass,
    uriFilters: uriFilters,
    spatialFilters: spatialFilters,
    textFilters: textFilters,
    timespanFilters: timespanFilters,
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
};

const generateParentBlock = ({
  facetClass,
  facetID,
  uriFilters,
  spatialFilters,
  textFilters,
  timespanFilters,
  parentPredicate
}) => {
  const parentFilterStr = generateFilter({
    facetClass: facetClass,
    uriFilters: uriFilters,
    spatialFilters: spatialFilters,
    textFilters: textFilters,
    timespanFilters: timespanFilters,
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
