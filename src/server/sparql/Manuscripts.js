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
    type: 'hierarchical',
  },
  author: {
    id: 'author',
    label: 'Author',
    predicate: 'crm:P128_carries/^frbroo:R17_created/frbroo:R19_created_a_realisation_of/^frbroo:R16_initiated/mmm-schema:carried_out_by_as_author',
    type: 'table'
  },
  source: {
    id: 'source',
    label: 'Source',
    predicate: 'dct:source',
    type: 'checkboxes',
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
  // console.log(manuscriptQuery)
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
  return Promise.all(Object.values(facetConfigs).map(value => getFacet(value, filters)))
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

const getFacet = (facetConfig, filters) => {
  let { endpoint, facetQuery } = datasetConfig['mmm'];
  //console.log(filters)
  if (filters == null) {
    facetQuery = facetQuery.replace('<FILTER>', '');
  } else {
    facetQuery = facetQuery.replace('<FILTER>', generateFacetFilter(facetConfig, filters));
  }
  facetQuery = facetQuery.replace('<PREDICATE>', facetConfig.predicate);
  // console.log(facetQuery)
  let mapper = facetConfig.type === 'hierarchical' ? mapHierarchicalFacet : makeObjectList;
  return sparqlSearchEngine.doSearch(facetQuery, endpoint, mapper);
};

const generateFacetFilter = (facetConfig, filters) => {
  delete filters[facetConfig.id]; // apply filters only from other facets
  let filterStr = '';
  for (let property in filters) {
    filterStr += `
            VALUES ?${property}Filter { <${filters[property].join('> <')}> }
            ?id ${facetConfigs[property].predicate} ?${property}Filter .
    `;
  }
  // console.log(filterStr)
  return filterStr;
};

const generateResultFilter = filters => {
  //console.log(filters)
  let filterStr = '';
  for (let property in filters) {
    filterStr += `
            VALUES ?${property}Filter { <${filters[property].join('> <')}> }
            ?id ${facetConfigs[property].predicate} ?${property}Filter .
    `;
  }
  //console.log(filterStr)
  return filterStr;
};
