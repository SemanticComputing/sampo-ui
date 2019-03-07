import { has } from 'lodash';
import SparqlSearchEngine from './SparqlSearchEngine';
import { endpoint, facetValuesQuery } from './SparqlQueriesGeneral';
import { prefixes } from './SparqlQueriesPrefixes';
import { facetConfigs } from './FacetConfigs';
import { generateFilter } from './Filters';
import {
  mapFacet,
  mapHierarchicalFacet,
} from './Mappers';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getFacet = (resultClass, facetID, sortBy, sortDirection, filters) => {
  let q = facetValuesQuery;
  const facetConfig = facetConfigs[resultClass][facetID];
  let selectedBlock = '# no selections';
  let filterBlock = '# no filters';
  let parentBlock = '# no parents';
  let mapper = mapFacet;
  if (filters !== null) {
    filterBlock = generateFilter(resultClass, resultClass, filters, 'instance', facetID);
    if (has(filters, facetID)) {
      selectedBlock = `
            OPTIONAL {
               FILTER(?id IN ( <${filters[facetID].join('>, <')}> ))
               BIND(true AS ?selected_)
            }
      `;
    }
  }
  if (facetConfig.type === 'hierarchical') {
    mapper = mapHierarchicalFacet;
    parentBlock = `
            UNION
            {
              ${generateFilter(resultClass, resultClass, filters, 'different_instance', facetID)}
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
  q = q.replace(/<RDF_TYPE>/g, facetConfigs[resultClass].rdfType);
  q = q.replace(/<FILTER>/g, filterBlock );
  q = q.replace(/<PREDICATE>/g, facetConfig.predicate);
  q = q.replace('<SELECTED_VALUES>', selectedBlock);
  q = q.replace('<FACET_VALUE_FILTER>', facetConfig.facetValueFilter);
  q = q.replace('<PARENTS>', parentBlock);
  q = q.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})` );
  // if (facetID == 'area') {
  //   //console.log(filters)
  //   console.log(prefixes + q)
  // }
  return sparqlSearchEngine.doSearch(prefixes + q, endpoint, mapper);
};
