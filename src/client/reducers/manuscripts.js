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
} from './helpers';

export const INITIAL_STATE = {
  results: [],
  paginatedResults: [],
  resultCount: 0,
  resultsUpdateID: -1,
  instance: {},
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  sparqlQuery: null,
  tableColumns: [
    {
      id: 'prefLabel',
      label: 'Label',
      desc: `
        A short label describing the manuscript
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'author',
      label: 'Author',
      desc: `
        The author(s) who have contributed to the intellectual content (works)
        contained in the manuscript.
      `,
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'productionPlace',
      label: 'Production place',
      desc: `
        The location where the manuscript was written. Multiple places of
        production may appear for a single manuscript, when there are
        discrepancies between the contributing data sources or when the
        precise location is uncertain, or when the production indeed took
        place in several places (e.g. for composite manuscripts).
      `,
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
    },
    {
      id: 'productionTimespan',
      label: 'Production year',
      desc: `
        The date when the manuscript was written. Multiple production dates
        may appear for a single manuscript, when there are discrepancies
        between the contributing data sources or when the precise date is
        uncertain.
      `,
      valueType: 'object',
      makeLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
    },
    {
      id: 'event',
      label: 'Event',
      desc: `
        Events related to the manuscript.
      `,
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 280,
    },
    {
      id: 'language',
      label: 'Language',
      desc: `
        The language(s) in which the manuscript was written.
      `,
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    // // {
    // //   id: 'material',
    // //   label: 'Material'
    // //   desc: 'Material description'
    // //   valueType: 'string',
    // //   makeLink: true,
    // //   sortValues: true
    // //   numberedList: false
    // // },

    {
      id: 'owner',
      label: 'Owner',
      desc: `
        Former or current owners (individual or institutional).
      `,
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'source',
      label: 'Source',
      desc: `
        The source dataset(s) (Bibale, Bodleian, or SDBM) contributing the
        information on the manuscript. If two or more source datasets include
        the same manuscript and this has been manually verified, the information
        from the source datasets has been merged into one table row. Click on
        the source name to view the original record on the source’s website.
      `,
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
  ],
};

const manuscripts = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'manuscripts') {
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
      default:
        return state;
    }
  } else return state;
};

export default manuscripts;
