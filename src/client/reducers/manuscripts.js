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
  UPDATE_PERSPECTIVE_HEADER_EXPANDED,
  UPDATE_URL
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
      label: 'Label',
      desc: `
        A short label describing the manuscript.
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
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'work',
      label: 'Work',
      desc: 'The intellectual content (works) contained in the manuscript.',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      priority: 5
    },
    {
      id: 'expression',
      label: 'Expression',
      desc: 'The linguistic versions of the works contained in the manuscript.',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      priority: 5
    },
    {
      id: 'productionPlace',
      label: 'Production place',
      desc: `
        The location where the manuscript was written. Multiple production places
        may appear for a single manuscript due to the following reasons:  1) there
        are discrepancies in the contributing data source,  2) there are discrepancies
        between several contributing data sources, 3) the precise date is uncertain,
        4) the production indeed took place on several occasions (e.g. for composite
        manuscripts).
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
    },
    {
      id: 'productionTimespan',
      label: 'Production date',
      desc: `
        The date when the manuscript was written. Multiple production dates may appear
        for a single manuscript due to the following reasons:  1) there are discrepancies
        in the contributing data source,  2) there are discrepancies between several
        contributing data sources, 3) the precise date is uncertain, 4) the production
        indeed took place on several occasions (e.g. for composite manuscripts).
      `,
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
    },
    {
      id: 'note',
      label: 'Note',
      desc: `
        Other info such as distinguishing characteristics, notes on the physical structure
        of the manuscript, script types, note glosses, physical relationships among various
        texts and/or parts of a miscellany, such as multiple types of page layout.
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      collapsedMaxWords: 12,
    },
    {
      id: 'language',
      label: 'Language',
      desc: `
        The language(s) in which the manuscript was written.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'event',
      label: 'Event',
      desc: `
        Events related to the manuscript.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 330,
    },
    {
      id: 'owner',
      label: 'Owner',
      desc: `
        Former or current owners (individual or institutional).
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'collection',
      label: 'Collection',
      desc: `
        The collection(s) that the manuscript has been part of at some point in time.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'transferOfCustodyPlace',
      label: 'Transfer of Custody Place',
      desc: `
        The locations of “Transfer of Custody” events related to the manuscript.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
    },
    {
      id: 'transferOfCustodyTimespan',
      label: 'Transfer of Custody Date',
      desc: `
        The dates of “Transfer of Custody” events related to the manuscript.
      `,
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
    },
    {
      id: 'material',
      label: 'Material',
      desc: `
        The physical material on which the text is written.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'height',
      label: 'Height',
      desc: `
        The height of the manuscript in millimeters.
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 140,
    },
    {
      id: 'width',
      label: 'Width',
      desc: `
        The width of the manuscript in millimeters.
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'folios',
      label: 'Folios',
      desc: `
        The number of folios (leaves).
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'lines',
      label: 'Lines',
      desc: `
        The number of lines in a text block. Left blank if the number of lines
        occurring throughout the manuscript is too irregular to be a useful
        descriptor for searching.
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'columns',
      label: 'Columns',
      desc: `
        The number of columns. Left blank if the number of columns
        occurring throughout the manuscript is too irregular to be a useful
        descriptor for searching.
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'miniatures',
      label: 'Miniatures',
      desc: `
        The number of miniatures.
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'decoratedInitials',
      label: 'Decorated initials',
      desc: `
        The number of decorated initials.
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'historiatedInitials',
      label: 'Historiated initials',
      desc: `
        The number of historiated initials.
      `,
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
    },
    {
      id: 'source',
      label: 'Source',
      desc: `
        The source dataset(s) (Bibale, Bodleian, or SDBM) contributing the
        information on the manuscript. If two or more source datasets include
        the same manuscript and this has been manually verified, the information
        from the source datasets have been merged into one manuscript (table row).
         Click on the links to view the original record on the source’s website.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
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
      case UPDATE_PERSPECTIVE_HEADER_EXPANDED:
        return updateHeaderExpanded(state);
      case UPDATE_URL:
        return(state);
      default:
        return state;
    }
  } else return state;
};

export default manuscripts;
