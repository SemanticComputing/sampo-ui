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
  let selectedNoHitsBlock = '# no selections';
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
    // const noHitsFilter = generateFilter({
    //   facetClass: facetClass,
    //   uriFilters: uriFilters,
    //   spatialFilters: spatialFilters,
    //   filterTarget: 'third_instance',
    //   facetID: facetID
    // });
    // selectedNoHitsBlock = `
    //
    //         FILTER NOT EXISTS {
    //           ${filterBlock}
    //         }
    //         FILTER(?id IN ( <${uriFilters[facetID].join('>, <')}> ))
    // `;
  }
  if (facetConfig.type === 'hierarchical') {
    mapper = mapHierarchicalFacet;
    const parentFilterStr = generateFilter({
      facetClass: facetClass,
      uriFilters: uriFilters,
      spatialFilters: spatialFilters,
      filterTarget: 'different_instance',
      facetID: facetID });
    parentBlock = `
          UNION
          {
            ${parentFilterStr}
            ?different_instance ${facetConfig.parentPredicate} ?id .
            OPTIONAL { ?id skos:prefLabel ?prefLabel_ }
            BIND(COALESCE(STR(?prefLabel_), STR(?id)) AS ?prefLabel)
            OPTIONAL {
              ?id gvp:broaderPreferred ?parent_
            }
            BIND(COALESCE(?selected_, false) as ?selected)
            BIND(COALESCE(?parent_, '0') as ?parent)
          }
      `;
  }
  q = q.replace('<SELECTED_VALUES>', selectedBlock);
  //q = q.replace('<SELECTED_VALUES_NO_HITS>', selectedNoHitsBlock);
  q = q.replace(/<FACET_VALUE_FILTER>/g, facetConfig.facetValueFilter);
  q = q.replace(/<PARENTS>/g, parentBlock);
  q = q.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})` );
  q = q.replace(/<RDF_TYPE>/g, facetConfigs[facetClass].rdfType);
  q = q.replace(/<FILTER>/g, filterBlock );
  q = q.replace(/<PREDICATE>/g, facetConfig.predicate);
  if (facetID == 'productionPlace') {
    // console.log(uriFilters)
    console.log(prefixes + q)
  }
  return runSelectQuery(prefixes + q, endpoint, mapper);
};
