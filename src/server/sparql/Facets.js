import { has } from 'lodash';
import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import { facetConfigs } from './FacetConfigs';
import {
  mapFacet,
  mapHierarchicalFacet,
} from './Mappers';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getFacet = (resultClass, facetID, sortBy, sortDirection, filters) => {
  let { endpoint, facetQuery } = datasetConfig['mmm'];
  const facetConfig = facetConfigs[resultClass][facetID];
  let selectedBlock = '# no selections';
  let filterBlock = '# no filters';
  let parentBlock = '# no parents';
  let mapper = mapFacet;
  if (filters !== null) {
    filterBlock = generateFacetFilter(resultClass, facetID, filters);
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
              ${generateFacetFilterParents(resultClass, facetID, filters)}
              ?instance ${facetConfig.parentPredicate} ?id .
              BIND(COALESCE(?selected_, false) as ?selected)
              OPTIONAL { ?id skos:prefLabel ?prefLabel_ }
              BIND(COALESCE(STR(?prefLabel_), STR(?id)) AS ?prefLabel)
              OPTIONAL { ?id dct:source ?source }
              OPTIONAL { ?id gvp:broaderPreferred ?parent_ }
              BIND(COALESCE(?parent_, '0') as ?parent)
            }
      `;
  }
  facetQuery = facetQuery.replace(/<RDF_TYPE>/g, facetConfigs[resultClass].rdfType);
  facetQuery = facetQuery.replace(/<FILTER>/g, filterBlock );
  facetQuery = facetQuery.replace(/<PREDICATE>/g, facetConfig.predicate);
  facetQuery = facetQuery.replace('<SELECTED_VALUES>', selectedBlock);
  facetQuery = facetQuery.replace('<PARENTS>', parentBlock);
  facetQuery = facetQuery.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})` );
  // if (id == 'productionPlace') {
  //   //console.log(filters)
  // console.log(facetQuery)
  // }
  return sparqlSearchEngine.doSearch(facetQuery, endpoint, mapper);
};

const generateFacetFilter = (resultClass, facetID, filters) => {
  let filterStr = '';
  for (let property in filters) {
    if (property !== facetID) {
      filterStr += `
            VALUES ?${property}Filter { <${filters[property].join('> <')}> }
            ?instance ${facetConfigs[resultClass][facetID].predicate} ?${property}Filter .
      `;
    }
  }
  return filterStr;
};

const generateFacetFilterParents = (resultClass, facetID, filters) => {
  let filterStr = '';
  for (let property in filters) {
    if (property !== facetID) {
      filterStr += `
              VALUES ?${property}FilterParents { <${filters[property].join('> <')}> }
              ?instance ${facetConfigs[resultClass][property].predicate} ?${property}FilterParents .
      `;
    }
  }
  return filterStr;
};
