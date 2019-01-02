import { has } from 'lodash';
import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import {
  mapFacet,
  mapHierarchicalFacet,
  mapCount,
} from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';

const sparqlSearchEngine = new SparqlSearchEngine();

const facetConfigs = {
  productionPlace: {
    id: 'productionPlace',
    label: 'Production place',
    labelPath: '^crm:P108_has_produced/crm:P7_took_place_at/skos:prefLabel',
    predicate: '^crm:P108_has_produced/crm:P7_took_place_at',
    parentPredicate: '^crm:P108_has_produced/crm:P7_took_place_at/crm:P89_falls_within*',
    type: 'hierarchical',
  },
  author: {
    id: 'author',
    label: 'Author',
    labelPath: 'mmm-schema:manuscript_author/skos:prefLabel',
    predicate: 'mmm-schema:manuscript_author',
    type: 'list'
  },
  source: {
    id: 'source',
    label: 'Source',
    labelPath: 'dct:source/skos:prefLabel',
    predicate: 'dct:source',
    type: 'list',
  },
  language: {
    id: 'language',
    label: 'Language',
    labelPath: 'crm:P128_carries/crm:P72_has_language',
    predicate: 'crm:P128_carries/crm:P72_has_language',
    type: 'list',
  },
  productionTimespan: {
    id: 'productionTimespan',
    label: 'Production Date',
    labelPath: '^crm:P108_has_produced/crm:P4_has_time-span/skos:prefLabel',
    type: 'list',
  },
  prefLabel: {
    id: 'prefLabel',
    label: 'Title',
    labelPath: 'skos:prefLabel',
    type: 'list',
  },
  event: {
    id: 'event',
    label: 'Event',
    labelPath: '^mmm-schema:observed_manuscript/mmm-schema:observed_time-span',
    type: 'list',
  },
};

export const getManuscripts = (page, pagesize, filters, sortBy, sortDirection) => {
  return Promise.all([
    getManuscriptCount(filters),
    getManuscriptData(page, pagesize, filters, sortBy, sortDirection),
  ])
    .then(data => {
      return {
        manuscriptCount: data[0].count,
        pagesize: pagesize,
        page: page,
        manuscriptData: data[1]
      };
    })
    .catch(err => console.log(err));
};

const getManuscriptData = (page, pagesize, filters, sortBy, sortDirection) => {
  let { endpoint, manuscriptQuery } = datasetConfig['mmm'];
  if (filters == null) {
    manuscriptQuery = manuscriptQuery.replace('<FILTER>', '');
  } else {
    manuscriptQuery = manuscriptQuery.replace('<FILTER>', generateResultFilter(filters));
  }
  manuscriptQuery = manuscriptQuery.replace('<ORDER_BY_PREDICATE>', facetConfigs[sortBy].labelPath);
  manuscriptQuery = manuscriptQuery.replace('<SORT_DIRECTION>', sortDirection);
  manuscriptQuery = manuscriptQuery.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`);
  //console.log(manuscriptQuery)
  return sparqlSearchEngine.doSearch(manuscriptQuery, endpoint, makeObjectList);
};

const getManuscriptCount = filters => {
  let { endpoint, countQuery } = datasetConfig['mmm'];
  countQuery = countQuery.replace('<FILTER>', generateResultFilter(filters));
  return sparqlSearchEngine.doSearch(countQuery, endpoint, mapCount);
};

export const getPlaces = variant => {
  // console.log(variant)
  const config = datasetConfig['mmm'];
  const query = config[`${variant}Query`];
  // console.log(query)
  return sparqlSearchEngine.doSearch(query, config.endpoint, makeObjectList);
};

export const getPlace = id => {
  let { endpoint, placeQuery } = datasetConfig['mmm'];
  placeQuery = placeQuery.replace('<PLACE_ID>', `<${id}>`);
  return sparqlSearchEngine.doSearch(placeQuery, endpoint, makeObjectList);
};

export const getFacets = filters => {
  return Promise.all(Object.keys(facetConfigs).map(id => getFacet(id, filters)))
    .then(data => {
      let results = {};
      let i = 0;
      Object.keys(facetConfigs).forEach(key => {
        results[key] = data[i];
        i += 1;
      });
      return results;
    });
};

export const getFacet = (id, filters) => {
  let { endpoint, facetQuery } = datasetConfig['mmm'];
  //console.log(id, filters)
  const facetConfig = facetConfigs[id];
  let selectedBlock = '# no selections';
  let filterBlock = '# no filters';
  let parentBlock = '# no parents';
  let mapper = mapFacet;
  if (filters !== null) {
    filterBlock = generateFacetFilter(id, filters);
    if (has(filters, id)) {
      selectedBlock = `
            OPTIONAL {
               FILTER(?id IN ( <${filters[id].join('>, <')}> ))
               BIND(true AS ?selected_)
            }
      `;
    }
  }
  if (facetConfig.type === 'hierarchical') {
    mapper = mapHierarchicalFacet;
    if (filters !== null) {
      parentBlock = `
            UNION
            {
              ${generateFacetFilterParents(id, filters)}
              ?parentInstance ${facetConfig.parentPredicate} ?id .
              BIND(COALESCE(?selected_, false) as ?selected)
              OPTIONAL { ?id dct:source ?source }
              OPTIONAL { ?id crm:P89_falls_within ?parent_ }
              BIND(COALESCE(?parent_, '0') as ?parent)
            }
      `;
    }
  }
  facetQuery = facetQuery.replace(/<FILTER>/g, filterBlock );
  facetQuery = facetQuery.replace(/<PREDICATE>/g, facetConfig.predicate);
  facetQuery = facetQuery.replace('<SELECTED_VALUES>', selectedBlock);
  facetQuery = facetQuery.replace('<PARENTS>', parentBlock);
  // if (id == 'author') {
  //   //console.log(filters)
  //   console.log(facetQuery)
  // }
  return sparqlSearchEngine.doSearch(facetQuery, endpoint, mapper);
};

const generateFacetFilter = (facetId, filters) => {
  let filterStr = '';
  for (let property in filters) {
    if (property !== facetId) {
      filterStr += `
            VALUES ?${property}Filter { <${filters[property].join('> <')}> }
            ?instance ${facetConfigs[property].predicate} ?${property}Filter .
      `;
    }
  }
  return filterStr;
};

const generateFacetFilterParents = (facetId, filters) => {
  let filterStr = '';
  for (let property in filters) {
    if (property !== facetId) {
      filterStr += `
              VALUES ?${property}FilterParents { <${filters[property].join('> <')}> }
              ?parentInstance ${facetConfigs[property].predicate} ?${property}FilterParents .
      `;
    }
  }
  return filterStr;
};

const generateResultFilter = filters => {
  let filterStr = '';
  for (let property in filters) {
    filterStr += `
            VALUES ?${property}Filter { <${filters[property].join('> <')}> }
            ?id ${facetConfigs[property].predicate} ?${property}Filter .
    `;
  }
  return filterStr;
};
