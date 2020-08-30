import { handleDataFetchingAction } from '../general/results'

export const INITIAL_STATE = {
  results: null,
  resultUpdateID: 0,
  resultsSparqlQuery: null,
  paginatedResults: [],
  paginatedResultsSparqlQuery: null,
  resultCount: 0,
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  facetedSearchHeaderExpanded: false,
  instancePageHeaderExpanded: false,
  instanceTableData: null,
  instanceTableExternalData: null,
  instanceAnalysisData: null,
  instanceAnalysisDataUpdateID: 0,
  instanceSparqlQuery: null,
  properties: [
    {
      id: 'uri',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      onlyOnInstancePage: true
    },
    {
      id: 'prefLabel',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'gender',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 90,
      priority: 5
    },
    {
      id: 'type',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 90,
      priority: 5
    },
    {
      id: 'related',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      priority: 8,
      onlyOnInstancePage: true
    },
    {
      id: 'birthDateTimespan',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      showSource: true,
      sourceExternalLink: true,
      minWidth: 250
    },
    {
      id: 'deathDateTimespan',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      showSource: true,
      sourceExternalLink: true,
      minWidth: 250
    },
    {
      id: 'altLabel',
      valueType: 'string',
      renderAsHTML: false,
      makeLink: false,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 150,
      collapsedMaxWords: 12,
      onlyOnInstancePage: true
    },
    {
      id: 'rel',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 220,
      onlyOnInstancePage: true
    },
    {
      id: 'cor',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 220,
      onlyOnInstancePage: true
    },
    {
      id: 'knownLocation',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 220,
      onlyOnInstancePage: true
    }
  ]
}

const resultClasses = new Set([
  'emloActors', 'emloLetterNetwork', 'emloSentReceived'
])

const emloActors = (state = INITIAL_STATE, action) => {
  if (resultClasses.has(action.resultClass)) {
    return handleDataFetchingAction(state, action)
  } else return state
}

export default emloActors
