import { has } from 'lodash';
import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import {
  mapHierarchicalFacet,
  mapCount,
} from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';

const sparqlSearchEngine = new SparqlSearchEngine();

const facetConfigs = {
  productionPlace: {
    id: 'productionPlace',
    label: 'Production place',
    predicate: '^crm:P108_has_produced/crm:P7_took_place_at',
    //predicate: '^crm:P108_has_produced/crm:P7_took_place_at|^crm:P108_has_produced/crm:P7_took_place_at/crm:P89_falls_within*',
    type: 'hierarchical',
  },
  author: {
    id: 'author',
    label: 'Author',
    //predicate: 'crm:P128_carries/^frbroo:R17_created/frbroo:R19_created_a_realisation_of/^frbroo:R16_initiated/mmm-schema:carried_out_by_as_author',
    predicate: 'mmm-schema:author',
    type: 'hierarchical'
  },
  source: {
    id: 'source',
    label: 'Source',
    predicate: 'dct:source',
    type: 'hierarchical',
  },
};

export const getManuscripts = (page, pagesize, filters) => {
  return Promise.all([
    getManuscriptCount(filters),
    getManuscriptData(page, pagesize, filters),
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

const getManuscriptData = (page, pagesize, filters) => {
  let { endpoint, manuscriptQuery } = datasetConfig['mmm'];
  if (filters == null) {
    manuscriptQuery = manuscriptQuery.replace('<FILTER>', '');
  } else {
    manuscriptQuery = manuscriptQuery.replace('<FILTER>', generateResultFilter(filters));
  }
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
  if (filters !== null) {
    filterBlock = generateFacetFilter(id, facetConfig, filters);
    if (has(filters, id)) {
      selectedBlock = `
            OPTIONAL {
               FILTER(?id IN ( <${filters[id].join('>, <')}> ))
               BIND(true AS ?selected_)
            }
      `;
    }
  }
  facetQuery = facetQuery.replace('<FILTER>', filterBlock );
  facetQuery = facetQuery.replace('<PREDICATE>', facetConfig.predicate);
  facetQuery = facetQuery.replace('<SELECTED_VALUES>', selectedBlock);
  // if (id == 'author') {
  //   console.log(filters)
  //   console.log(facetQuery)
  // }
  let mapper = facetConfig.type === 'hierarchical' ? mapHierarchicalFacet : makeObjectList;
  return sparqlSearchEngine.doSearch(facetQuery, endpoint, mapper);
};

const generateFacetFilter = (facetId, facetConfig, filters) => {
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
