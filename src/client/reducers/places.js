import {
  FETCH_RESULTS,
  FETCH_RESULT_COUNT,
  FETCH_RESULTS_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_BY_URI,
  UPDATE_RESULT_COUNT,
  UPDATE_RESULTS,
  UPDATE_PAGINATED_RESULTS,
  UPDATE_INSTANCE,
  UPDATE_PAGE,
  UPDATE_ROWS_PER_PAGE,
  SORT_RESULTS,
  UPDATE_PERSPECTIVE_HEADER_EXPANDED
} from '../actions';
import {
  fetchResults,
  fetchResultsFailed,
  fetchResultCount,
  updateSortBy,
  updateResultCount,
  updateResults,
  updatePaginatedResults,
  updateInstance,
  updatePage,
  updateRowsPerPage,
  updateHeaderExpanded
} from './helpers';

export const INITIAL_STATE = {
  results: [],
  resultsSparqlQuery: null,
  paginatedResults: [],
  paginatedResultsSparqlQuery: null,
  instance: null,
  instanceSparqlQuery: null,
  resultCount: 0,
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: 'asc',
  fetching: false,
  fetchingResultCount: false,
  sparqlQuery: null,
  facetedSearchHeaderExpanded: true,
  instancePageHeaderExpanded: true,
  tableColumns: [
    {
      id: 'uri',
      label: 'URI',
      desc: `
        Uniform Resource Identifier
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      onlyOnInstancePage: true
    },
    {
      id: 'prefLabel',
      label: 'Name',
      desc: 'The name of the place. ',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 170
    },
    {
      id: 'placeType',
      label: 'Place type',
      desc: 'The place type from Getty Thesaurus of Geographic Names.',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 170
    },
    {
      id: 'area',
      label: 'Parent Place',
      desc: `
        The preferred parent place in the hierarchy used by the Getty
        Thesaurus of Geographic Names.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 170,
    },
    {
      id: 'manuscriptProduced',
      label: 'Manuscripts produced',
      desc: `
        Manuscript(s) produced here.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true
    },
    {
      id: 'manuscriptTransferred',
      label: 'Manuscripts transferred',
      desc: `
        The manuscript(s) that have a "Transfer of Custody" event located here.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true
    },
    {
      id: 'manuscriptObserved',
      label: 'Manuscripts observed',
      desc: `
        The manuscript(s) that have a provenance event located here.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true
    },
    {
      id: 'actor',
      label: 'Actor',
      desc: `
        The actor(s) associated with the place.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true
    },
    {
      id: 'source',
      label: 'Source',
      desc: `
        The source dataset (Schoenberg, Bibale, and Bodleian) and the place
        authority (Getty Thesaurus of Geographic Names and GeoNames)
        contributing the information on the place.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false
    },
  ],
};

const resultClasses = new Set([
  'places',
  'placesAll',
  'placesActors',
  'placesMsProduced',
  'placesMsMigrations',
  'placesEvents'
]);

const places = (state = INITIAL_STATE, action) => {
  if (resultClasses.has(action.resultClass)) {
    switch (action.type) {
      case FETCH_RESULTS:
      case FETCH_PAGINATED_RESULTS:
      case FETCH_BY_URI:
        return fetchResults(state);
      case FETCH_RESULT_COUNT:
        return fetchResultCount(state);
      case FETCH_RESULTS_FAILED:
      case FETCH_PAGINATED_RESULTS_FAILED:
        return fetchResultsFailed(state);
      case SORT_RESULTS:
        return updateSortBy(state, action);
      case UPDATE_RESULT_COUNT:
        return updateResultCount(state, action);
      case UPDATE_RESULTS:
        return updateResults(state, action);
      case UPDATE_PAGINATED_RESULTS:
        return updatePaginatedResults(state, action);
      case UPDATE_INSTANCE:
        return updateInstance(state, action);
      case UPDATE_PAGE:
        return updatePage(state, action);
      case UPDATE_ROWS_PER_PAGE:
        return updateRowsPerPage(state, action);
      case UPDATE_PERSPECTIVE_HEADER_EXPANDED:
        return updateHeaderExpanded(state, action);
      default:
        return state;
    }
  } else return state;
};

export default places;
