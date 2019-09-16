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
  paginatedResults: [],
  resultCount: 0,
  instance: null,
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  sparqlQuery: null,
  facetedSearchHeaderExpanded: true,
  instancePageHeaderExpanded: true,
  tableColumns: [
    {
      id: 'prefLabel',
      label: 'Name',
      desc: 'The standardized name of the actor.',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'type',
      label: 'Type',
      desc: `
        Indicates whether the actor is an individual (Person) or an institution,
        corporation, or family (Group)
      `,
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'birthDateTimespan',
      label: 'Birth / formation date',
      desc: 'The date when the actor was born or established.',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 220
    },
    {
      id: 'deathDateTimespan',
      label: 'Death / dissolution date',
      desc: 'The date when the actor died or dissolved.',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'place',
      label: 'Activity location',
      desc: 'Place(s) of activity linked to this actor.',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'work',
      label: 'Work',
      desc: 'Work(s) linked to the actor. ',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'manuscript',
      label: 'Manuscript',
      desc: 'Manuscript(s) linked to the actor.',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'source',
      label: 'Source',
      desc: `
        The source dataset(s) (Bibale, Bodleian, or SDBM) contributing the
        information on the actor. If two or more source datasets include the
        same actor and this has been manually verified, the information from
        the source datasets has been merged into one MMM actor.
        Click on the result table link(s) to view the original record on the
        source’s website.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false
    },
  ],
};

const actors = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'actors') {
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

export default actors;
