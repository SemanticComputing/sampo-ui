import { handleDataFetchingAction } from '../general/results'

export const INITIAL_STATE = {
  results: null,
  resultUpdateID: 0,
  resultsSparqlQuery: null,
  paginatedResults: [],
  paginatedResultsSparqlQuery: null,
  paginatedResultsAlwaysExpandRows: true,
  paginatedResultsRowContentMaxHeight: 190,
  resultCount: 0,
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  fetchingInstanceAnalysisData: false,
  facetedSearchHeaderExpanded: false,
  instancePageHeaderExpanded: false,
  instanceTableData: null,
  instanceTableExternalData: null,
  instanceAnalysisData: null,
  instanceAnalysisDataUpdateID: 0,
  instanceSparqlQuery: null,
  maps: {
    placesMsProduced: {
      center: [22.43, 10.37],
      zoom: 2
    },
    placesMsProducedHeatmap: {
      center: [22.43, 10.37],
      zoom: 2
    },
    lastKnownLocations: {
      center: [22.43, 10.37],
      zoom: 2
    },
    placesMsMigrations: {
      center: [22.43, 10.37],
      zoom: 2
    },
    casualtiesByMunicipality: {
      center: [65.184809, 27.314050],
      zoom: 4
    }
  },
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
      minWidth: 200
    },
    {
      id: 'author',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'work',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
      collapsedMaxWords: 3,
      priority: 5
    },
    {
      id: 'expression',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 180,
      collapsedMaxWords: 3,
      priority: 5
    },
    {
      id: 'productionPlace',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      showSource: true,
      sourceExternalLink: true,
      minWidth: 150
    },
    {
      id: 'productionTimespan',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      showSource: true,
      sourceExternalLink: true,
      minWidth: 150
    },
    {
      id: 'lastKnownLocation',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 160
    },
    {
      id: 'note',
      valueType: 'string',
      renderAsHTML: false,
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 220,
      collapsedMaxWords: 5,
      expandedOnInstancePage: true
    },
    {
      id: 'language',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'event',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'owner',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'collection',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'transferOfCustodyPlace',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'transferOfCustodyTimespan',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'material',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'height',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 140
    },
    {
      id: 'width',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'folios',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'lines',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'columns',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'miniatures',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150
    },
    {
      id: 'decoratedInitials',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 170
    },
    {
      id: 'historiatedInitials',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 170
    },
    {
      id: 'source',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    }
  ]
}

const resultClasses = new Set([
  'perspective1',
  'placesMsProduced',
  'placesMsProducedHeatmap',
  'lastKnownLocations',
  'placesMsMigrations',
  'placesMsMigrationsDialog',
  'productionTimespanLineChart',
  'productionsByDecadeAndCountry',
  'eventLineChart',
  'manuscriptInstancePageNetwork',
  'manuscriptFacetResultsNetwork',
  'perspective1KnowledgeGraphMetadata',
  'speechesByYearAndParty',
  'casualtiesByMunicipality'
])

const perspective1 = (state = INITIAL_STATE, action) => {
  if (resultClasses.has(action.resultClass)) {
    return handleDataFetchingAction(state, action, INITIAL_STATE)
  } else return state
}

export default perspective1
