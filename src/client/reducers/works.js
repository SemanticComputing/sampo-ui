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
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  sparqlQuery: null,
  facetedSearchHeaderExpanded: true,
  instancePageHeaderExpanded: true,
  properties: [
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
      label: 'Title',
      desc: 'The name or title of the Work.',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'author',
      label: 'Possible author',
      desc: `
        The author(s) associated with the Work. Because of the structure of
        entries in the Schoenberg Database, the authors shown as being
        associated with a Work may actually be associated with other
        Works in the same manuscript instead.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'language',
      label: 'Language',
      desc: `
        The language in which a Work is written in the manuscript
        (i.e., an “Expression” of a Work). One manuscript may contain multiple languages.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'manuscript',
      label: 'Manuscript',
      desc: `
        The specific manuscript(s) in which the Work can be found.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
    },
    {
      id: 'productionTimespan',
      label: 'Manuscript production date',
      desc: `
        The date when the manuscript(s) in which the Work can be found were written.
        Multiple production dates may appear for a single manuscript,
        when there are discrepancies between the contributing data source
        or when the precise date is uncertain.
      `,
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
    },
    {
      id: 'collection',
      label: 'Collection',
      desc: `
        The specific collection(s) of manuscripts in which a Work can be found.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'material',
      label: 'Material',
      desc: `
        The support material of each manuscript in which the Work occurs.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'source',
      label: 'Source',
      desc: `
        The source database (Schoenberg, Bibale, and Bodleian) that the Work
        occurs in. Currently one Work has always only one dataset as a source.
        Click on the result table link to view the original record on the
        source’s website.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
  ],
};

const works = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'works') {
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

export default works;
