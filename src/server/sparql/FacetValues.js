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
}) => {
  let q = facetValuesQuery;
  const facetConfig = facetConfigs[facetClass][facetID];
  let selectedBlock = '# no selections';
  let filterBlock = '# no filters';
  let parentBlock = '# no parents';
  let mapper = mapFacet;
  if (uriFilters !== null || spatialFilters !== null) {
    filterBlock = generateFilter({
      facetClass: facetClass,
      uriFilters: uriFilters,
      spatialFilters: spatialFilters,
      filterTarget: 'instance',
      facetID: facetID
    });
  }
  if (uriFilters !== null && has(uriFilters, facetID)) {
    selectedBlock = `
          OPTIONAL {
             FILTER(?id IN ( <${uriFilters[facetID].join('>, <')}> ))
             BIND(true AS ?selected_)
          }
    `;
  }
  if (facetConfig.type === 'hierarchical') {
    mapper = mapHierarchicalFacet;
    const filterStr = generateFilter({
      facetClass: facetClass,
      uriFilters: uriFilters,
      spatialFilters: spatialFilters,
      filterTarget: 'different_instance',
      facetID: facetID });
    parentBlock = `
            UNION
            {
              ${filterStr}
              ?different_instance ${facetConfig.parentPredicate} ?id .
              BIND(COALESCE(?selected_, false) as ?selected)
              OPTIONAL { ?id skos:prefLabel ?prefLabel_ }
              BIND(COALESCE(STR(?prefLabel_), STR(?id)) AS ?prefLabel)
              OPTIONAL { ?id dct:source ?source }
              OPTIONAL {
                ?id gvp:broaderPreferred ?parent_
              }
              BIND(COALESCE(?parent_, '0') as ?parent)
            }
      `;
  }
  q = q.replace(/<RDF_TYPE>/g, facetConfigs[facetClass].rdfType);
  q = q.replace(/<FILTER>/g, filterBlock );
  q = q.replace(/<PREDICATE>/g, facetConfig.predicate);
  q = q.replace('<SELECTED_VALUES>', selectedBlock);
  q = q.replace('<FACET_VALUE_FILTER>', facetConfig.facetValueFilter);
  q = q.replace('<PARENTS>', parentBlock);
  q = q.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})` );
  // if (facetID == 'source') {
  //   //console.log(uriFilters)
  //   console.log(prefixes + q)
  // }
  return runSelectQuery(prefixes + q, endpoint, mapper);
};
