import { has } from 'lodash';
import { runSelectQuery } from './SparqlApi';
import { endpoint, facetValuesQuery } from './SparqlQueriesGeneral';
import { prefixes } from './SparqlQueriesPrefixes';
import { facetConfigs } from './FacetConfigs';
import { generateFilter } from './Filters';
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
  let q = facetValuesQuery;
  const facetConfig = facetConfigs[facetClass][facetID];
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
  if (uriFilters !== null && has(uriFilters, facetID)) {
    selectedBlock = `
            OPTIONAL {
               FILTER(?id IN ( <${uriFilters[facetID].join('>, <')}> ))
               BIND(true AS ?selected_)
            }
    `;
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
      selectedNoHitsBlock = `
    UNION
    {
    # facet values that have been selected but return no results
      VALUES ?id { <${uriFilters[facetID].join('> <')}> }
      ${noHitsFilter}
      BIND(true AS ?selected_)
    }
      `;
    }
  }
  if (facetConfig.type === 'hierarchical') {
    mapper = mapHierarchicalFacet;
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
      ignoreSelectedValues = `FILTER(?id NOT IN ( <${uriFilters[facetID].join('>, <')}> ))`;
    }
    parentBlock = `
    UNION
    # parents for all facet values
    {
      ${parentFilterStr}
      ?instance2 ${facetConfig.parentPredicate} ?id .
      BIND(false AS ?selected_)
      ${ignoreSelectedValues}
    }
      `;
  }
  q = q.replace('<SELECTED_VALUES>', selectedBlock);
  q = q.replace('<SELECTED_VALUES_NO_HITS>', selectedNoHitsBlock);
  q = q.replace('<FACET_VALUE_FILTER>', facetConfig.facetValueFilter);
  q = q.replace('<PARENTS>', parentBlock);
  q = q.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})` );
  q = q.replace(/<RDF_TYPE>/g, facetConfigs[facetClass].rdfType);
  q = q.replace(/<FILTER>/g, filterBlock );
  q = q.replace(/<PREDICATE>/g, facetConfig.predicate);
  // if (facetID == 'productionPlace') {
  //   // console.log(uriFilters)
  //   console.log(prefixes + q)
  // }
  return runSelectQuery(prefixes + q, endpoint, mapper);
};
