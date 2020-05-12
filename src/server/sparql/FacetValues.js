import { runSelectQuery } from './SparqlApi'
import { has } from 'lodash'
import {
  facetValuesQuery,
  facetValuesQueryTimespan,
  facetValuesRange
} from './SparqlQueriesGeneral'
import { prefixes } from './sampo/SparqlQueriesPrefixes'
import {
  hasPreviousSelections,
  hasPreviousSelectionsFromOtherFacets,
  getUriFilters,
  generateConstraintsBlock,
  generateSelectedFilter
} from './Filters'
import {
  mapFacet,
  mapHierarchicalFacet,
  mapTimespanFacet
} from './Mappers'

export const getFacet = async ({
  backendSearchConfig,
  facetClass,
  facetID,
  sortBy,
  sortDirection,
  constraints,
  resultFormat,
  constrainSelf
}) => {
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const endpoint = backendSearchConfig[facetClass].endpoint
  // choose query template and result mapper:
  let q = ''
  let mapper = null
  let previousSelections = null
  switch (facetConfig.type) {
    case 'list':
      q = facetValuesQuery
      mapper = mapFacet
      break
    case 'hierarchical':
      q = facetValuesQuery
      mapper = mapHierarchicalFacet
      break
    case 'timespan':
      q = facetValuesQueryTimespan
      mapper = mapTimespanFacet
      break
    case 'integer':
      q = facetValuesRange
      mapper = mapTimespanFacet
      break
    default:
      q = facetValuesQuery
      mapper = mapFacet
  }
  let selectedBlock = '# no selections'
  let selectedNoHitsBlock = '# no filters from other facets'
  let filterBlock = '# no filters'
  let parentBlock = '# no parents'
  let parentsForFacetValues = '# no parents for facet values'
  if (constraints !== null) {
    filterBlock = generateConstraintsBlock({
      backendSearchConfig,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: 'instance',
      facetID: facetID,
      inverse: false,
      constrainSelf
    })
    previousSelections = new Set(getUriFilters(constraints, facetID))
    // if this facet has previous selections, include them in the query
    if (hasPreviousSelections(constraints, facetID)) {
      selectedBlock = generateSelectedBlock({
        facetID,
        constraints
      })
      /* if there are also filters from other facets, we need this
         additional block for facet values that return 0 hits */
      if (hasPreviousSelectionsFromOtherFacets(constraints, facetID)) {
        selectedNoHitsBlock = generateSelectedNoHitsBlock({
          facetClass,
          facetID,
          constraints
        })
      }
    }
  }
  if (facetConfig.type === 'hierarchical') {
    const { parentPredicate } = facetConfig
    parentBlock = generateParentBlock({
      facetClass,
      facetID,
      constraints,
      parentPredicate
    })
    parentsForFacetValues = `
      OPTIONAL { ?id ${facetConfig.parentProperty} ?parent_ }
      BIND(COALESCE(?parent_, '0') as ?parent)
    `
  }
  q = q.replace('<SELECTED_VALUES>', selectedBlock)
  q = q.replace('<SELECTED_VALUES_NO_HITS>', selectedNoHitsBlock)
  q = q.replace(/<FACET_VALUE_FILTER>/g, facetConfig.facetValueFilter)
  q = q.replace(/<FACET_LABEL_FILTER>/g,
    has(facetConfig, 'facetLabelFilter')
      ? facetConfig.facetLabelFilter
      : ''
  )
  q = q.replace('<PARENTS>', parentBlock)
  q = q.replace('<PARENTS_FOR_FACET_VALUES>', parentsForFacetValues)
  if (facetConfig.type === 'list') {
    q = q.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})`)
  } else {
    q = q.replace('<ORDER_BY>', '# no need for ordering')
  }
  q = q.replace(/<FACET_CLASS>/g, backendSearchConfig[facetClass].facetClass)
  q = q.replace(/<FILTER>/g, filterBlock)
  q = q.replace(/<PREDICATE>/g, facetConfig.predicate)
  if (facetConfig.type === 'timespan') {
    q = q.replace('<START_PROPERTY>', facetConfig.startProperty)
    q = q.replace('<END_PROPERTY>', facetConfig.endProperty)
  }
  // console.log(prefixes + q)
  const response = await runSelectQuery({
    query: prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: mapper,
    previousSelections,
    resultFormat
  })
  if (facetConfig.type === 'hierarchical') {
    return ({
      facetClass: facetClass,
      id: facetID,
      data: response.data.treeData,
      flatData: response.data.flatData,
      sparqlQuery: response.sparqlQuery
    })
  } else {
    return ({
      facetClass: facetClass,
      id: facetID,
      data: response.data,
      sparqlQuery: response.sparqlQuery
    })
  }
}

const generateSelectedBlock = ({
  backendSearchConfig,
  facetID,
  constraints
}) => {
  const selectedFilter = generateSelectedFilter({
    backendSearchConfig,
    facetID,
    constraints,
    inverse: false
  })
  return `
          OPTIONAL {
            ${selectedFilter}
            BIND(true AS ?selected_)
          }
  `
}

const generateSelectedNoHitsBlock = ({
  backendSearchConfig,
  facetClass,
  facetID,
  constraints
}) => {
  const noHitsFilter = generateConstraintsBlock({
    backendSearchConfig,
    facetClass: facetClass,
    constraints: constraints,
    filterTarget: 'instance',
    facetID: facetID,
    inverse: true
  })
  return `
  UNION
  {
  # facet values that have been selected but return no results
    VALUES ?id { <${getUriFilters(constraints, facetID).join('> <')}> }
    ${noHitsFilter}
    BIND(true AS ?selected_)
  }
    `
}

const generateParentBlock = ({
  backendSearchConfig,
  facetClass,
  facetID,
  constraints,
  parentPredicate
}) => {
  let parentFilterStr = '# no filters'
  let ignoreSelectedValues = '# no selected values'
  if (constraints !== null) {
    parentFilterStr = generateConstraintsBlock({
      backendSearchConfig,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: 'instance2',
      facetID: facetID,
      inverse: false
    })
    if (hasPreviousSelections) {
      ignoreSelectedValues = generateSelectedFilter({
        backendSearchConfig,
        facetID: facetID,
        constraints: constraints,
        inverse: true
      })
    }
  }
  return `
        UNION
        # parents for all facet values
        {
          ${parentFilterStr}
          # these instances should not be counted, so use another variable name
          ?instance2 ${parentPredicate} ?id .
          VALUES ?facetClass { <FACET_CLASS> }
          ?instance2 a ?facetClass .
          BIND(false AS ?selected_)
          ${ignoreSelectedValues}
        }
    `
}
