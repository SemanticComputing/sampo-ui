import { has } from 'lodash'
import { runSelectQuery } from './SparqlApi'
import { runNetworkQuery } from './NetworkApi'
import { makeObjectList } from './SparqlObjectMapper'
import { mapCount } from './Mappers'
import { generateConstraintsBlock } from './Filters'
import {
  countQuery,
  facetResultSetQuery,
  instanceQuery
} from './SparqlQueriesGeneral'

export const getPaginatedResults = ({
  backendSearchConfig,
  resultClass,
  page,
  pagesize,
  constraints,
  sortBy,
  sortDirection,
  resultFormat
}) => {
  let q = facetResultSetQuery
  const perspectiveConfig = backendSearchConfig[resultClass]
  const {
    endpoint,
    facets,
    facetClass,
    defaultConstraint = null,
    langTag = null,
    langTagSecondary = null
  } = perspectiveConfig
  const resultClassConfig = perspectiveConfig.resultClasses[resultClass]
  const {
    propertiesQueryBlock,
    filterTarget = 'id',
    resultMapper = makeObjectList,
    resultMapperConfig = null,
    postprocess = null
  } = resultClassConfig.paginatedResultsConfig
  if (constraints == null && defaultConstraint == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      facetClass: resultClass, // use resultClass as facetClass
      constraints,
      defaultConstraint,
      filterTarget,
      facetID: null
    }))
  }
  if (sortBy == null) {
    q = q.replace('<ORDER_BY_TRIPLE>', '')
    q = q.replace('<ORDER_BY>', '# no sorting')
  }
  if (sortBy !== null) {
    let sortByPredicate
    if (sortBy.endsWith('Timespan')) {
      sortByPredicate = sortDirection === 'asc'
        ? facets[sortBy].sortByAscPredicate
        : facets[sortBy].sortByDescPredicate
    } else {
      sortByPredicate = facets[sortBy].sortByPredicate
    }
    let sortByPattern
    if (has(facets[sortBy], 'sortByPattern')) {
      sortByPattern = facets[sortBy].sortByPattern
    } else {
      sortByPattern = `OPTIONAL { ?id ${sortByPredicate} ?orderBy }`
    }
    q = q.replace('<ORDER_BY_TRIPLE>', sortByPattern)
    q = q = q.replace('<ORDER_BY>', `ORDER BY (!BOUND(?orderBy)) ${sortDirection}(?orderBy)`)
  }
  q = q.replace(/<FACET_CLASS>/g, facetClass)
  q = q.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`)
  q = q.replace('<RESULT_SET_PROPERTIES>', propertiesQueryBlock)
  if (langTag) {
    q = q.replace(/<LANG>/g, langTag)
  }
  if (langTagSecondary) {
    q = q.replace(/<LANG_SECONDARY>/g, langTagSecondary)
  }
  // console.log(endpoint.prefixes + q)
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper,
    resultMapperConfig,
    postprocess,
    resultFormat
  })
}

export const getAllResults = ({
  backendSearchConfig,
  resultClass,
  facetClass,
  uri,
  constraints,
  resultFormat,
  optimize,
  limit,
  fromID = null,
  toID = null
}) => {
  const config = backendSearchConfig[resultClass]
  let endpoint
  let defaultConstraint = null
  let langTag = null
  let langTagSecondary = null
  if (has(config, 'perspectiveID')) {
    ({ endpoint, defaultConstraint, langTag, langTagSecondary } = backendSearchConfig[config.perspectiveID])
  } else {
    ({ endpoint, defaultConstraint, langTag, langTagSecondary } = config)
  }
  const { filterTarget, resultMapper, resultMapperConfig, postprocess = null } = config
  let { q } = config
  if (constraints == null && defaultConstraint == null) {
    q = q.replace(/<FILTER>/g, '# no filters')
  } else {
    q = q.replace(/<FILTER>/g, generateConstraintsBlock({
      backendSearchConfig,
      facetClass,
      constraints,
      defaultConstraint,
      filterTarget,
      facetID: null
    }))
  }
  q = q.replace(/<FACET_CLASS>/g, backendSearchConfig[config.perspectiveID].facetClass)
  if (langTag) {
    q = q.replace(/<LANG>/g, langTag)
  }
  if (langTagSecondary) {
    q = q.replace(/<LANG_SECONDARY>/g, langTagSecondary)
  }
  if (fromID) {
    q = q.replace(/<FROM_ID>/g, `<${fromID}>`)
  }
  if (toID) {
    q = q.replace(/<TO_ID>/g, `<${toID}>`)
  }
  if (has(config, 'useNetworkAPI') && config.useNetworkAPI) {
    return runNetworkQuery({
      endpoint: endpoint.url,
      prefixes: endpoint.prefixes,
      id: uri,
      links: q,
      nodes: config.nodes,
      optimize,
      limit
    })
  } else {
    if (uri !== null) {
      q = q.replace(/<ID>/g, `<${uri}>`)
    }
    // console.log(endpoint.prefixes + q)
    return runSelectQuery({
      query: endpoint.prefixes + q,
      endpoint: endpoint.url,
      useAuth: endpoint.useAuth,
      resultMapper,
      resultMapperConfig,
      postprocess,
      resultFormat
    })
  }
}

export const getResultCount = ({
  backendSearchConfig,
  resultClass,
  constraints,
  resultFormat
}) => {
  let q = countQuery
  const perspectiveConfig = backendSearchConfig[resultClass]
  const {
    endpoint,
    defaultConstraint = null
  } = perspectiveConfig
  if (constraints == null && defaultConstraint == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      facetClass: resultClass, // use resultClass as facetClass
      constraints,
      defaultConstraint,
      filterTarget: 'id',
      facetID: null,
      filterTripleFirst: true
    }))
  }
  q = q.replace(/<FACET_CLASS>/g, perspectiveConfig.facetClass)
  // console.log(endpoint.prefixes + q)
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: mapCount,
    resultFormat
  })
}

export const getByURI = ({
  backendSearchConfig,
  resultClass,
  facetClass,
  constraints,
  uri,
  resultFormat
}) => {
  const perspectiveConfig = backendSearchConfig[resultClass]
  const {
    endpoint,
    langTag = null,
    langTagSecondary = null
  } = perspectiveConfig
  const resultClassConfig = perspectiveConfig.resultClasses[resultClass]
  const {
    propertiesQueryBlock,
    filterTarget = 'related__id',
    relatedInstances = '',
    noFilterForRelatedInstances = false,
    resultMapper = makeObjectList,
    resultMapperConfig = null,
    postprocess = null
  } = resultClassConfig.instancePageConfig
  let q = instanceQuery
  q = q.replace('<PROPERTIES>', propertiesQueryBlock)
  q = q.replace('<RELATED_INSTANCES>', relatedInstances)
  if (constraints == null || noFilterForRelatedInstances) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget,
      facetID: null
    }))
  }
  q = q.replace(/<ID>/g, `<${uri}>`)
  if (langTag) {
    q = q.replace(/<LANG>/g, langTag)
  }
  if (langTagSecondary) {
    q = q.replace(/<LANG_SECONDARY>/g, langTagSecondary)
  }
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper,
    resultMapperConfig,
    postprocess,
    resultFormat
  })
}
