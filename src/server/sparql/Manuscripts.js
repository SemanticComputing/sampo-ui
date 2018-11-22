import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import {
  mapFacet,
  mapCount,
  //mapManuscripts
} from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';

const sparqlSearchEngine = new SparqlSearchEngine();


export const getManuscripts = (page, pagesize, filterObj) => {
  return Promise.all([
    getManuscriptCount(filterObj),
    getManuscriptData(page, pagesize, filterObj),
  ]).then(data => {
    return {
      manuscriptCount: data[0].count,
      pagesize: pagesize,
      page: page,
      manuscriptData: data[1]
    };
  });
};

const getManuscriptData = (page, pagesize, filterObj) => {
  let { endpoint, manuscriptQuery } = datasetConfig['mmm'];
  if (filterObj == null) {
    manuscriptQuery = manuscriptQuery.replace('<FILTER>', '');
  } else {
    manuscriptQuery = manuscriptQuery.replace('<FILTER>', generateFilter(filterObj));
  }
  manuscriptQuery = manuscriptQuery.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`);
  // console.log(manuscriptQuery)
  return sparqlSearchEngine.doSearch(manuscriptQuery, endpoint, makeObjectList);
};

const getManuscriptCount = filterObj => {
  let { endpoint, countQuery } = datasetConfig['mmm'];
  countQuery = countQuery.replace('<FILTER>', generateFilter(filterObj));
  return sparqlSearchEngine.doSearch(countQuery, endpoint, mapCount);
};

export const getPlaces = variant => {
  // console.log(variant)
  const config = datasetConfig['mmm'];
  const query = config[`${variant}Query`];
  // console.log(query) 
  return sparqlSearchEngine.doSearch(query, config.endpoint, makeObjectList);
};

export const getPlace = (id) => {
  let { endpoint, placeQuery } = datasetConfig['mmm'];
  placeQuery = placeQuery.replace('<PLACE_ID>', `<http://ldf.fi/mmm/place/${id}>`);
  return sparqlSearchEngine.doSearch(placeQuery, endpoint, makeObjectList);
};

export const getFacet = () => {
  const { endpoint, facetQuery } = datasetConfig['mmm'];
  // console.log(facetQuery)
  return sparqlSearchEngine.doSearch(facetQuery, endpoint, mapFacet);
};

const generateFilter = filterObj => {
  const facetOptions = {
    creationPlace: {
      predicate: '^frbroo:R18_created/crm:P7_took_place_at',
      hierarchical: true,
    },
    author: {
      hierarchical: false,
      predicate: '^frbroo:R18_created/crm:P14_carried_out_by',
    }
  };

  //filterObj.creationPlace.predicate = '^<http://erlangen-crm.org/efrbroo/R18_created>/<http://www.cidoc-crm.org/cidoc-crm/P7_took_place_at>';
  let filterStr = '';

  for (let property in filterObj) {
    //console.log(filterObj[property])
    filterStr += `
            ?id ${facetOptions[property].predicate} ?${property}Filter
            VALUES ?${property}Filter { <${filterObj[property].join('> <')}> }
      `;
  }
  return filterStr;
};
