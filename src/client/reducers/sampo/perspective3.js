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
      id: 'type',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'manuscript',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'eventTimespan',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'place',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'surrender',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true,
      onlyForClass: 'http://erlangen-crm.org/current/E10_Transfer_of_Custody'
    },
    {
      id: 'receiver',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true,
      onlyForClass: 'http://erlangen-crm.org/current/E10_Transfer_of_Custody'
    },
    {
      id: 'observedOwner',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true,
      onlyForClass: 'http://erlangen-crm.org/current/E7_Activity'
    },
    {
      id: 'note',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      collapsedMaxWords: 12,
      onlyOnInstancePage: true
    },
    {
      id: 'source',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    }
  ]
}

const resultClasses = new Set([
  'perspective3'
])

const perspective3 = (state = INITIAL_STATE, action) => {
  if (resultClasses.has(action.resultClass)) {
    return handleDataFetchingAction(state, action)
  } else return state
}

export default perspective3
