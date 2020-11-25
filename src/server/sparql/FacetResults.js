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
  const config = backendSearchConfig[resultClass]
  let endpoint
  let defaultConstraint = null
  let langTag = null
  if (has(config, 'perspectiveID')) {
    ({ endpoint, defaultConstraint, langTag } = backendSearchConfig[config.perspectiveID])
  } else {
    ({ endpoint, defaultConstraint, langTag } = config)
  }
  if (constraints == null && defaultConstraint == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      facetClass: resultClass, // use resultClass as facetClass
      constraints,
      defaultConstraint,
      filterTarget: 'id',
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
        ? config.facets[sortBy].sortByAscPredicate
        : config.facets[sortBy].sortByDescPredicate
    } else {
      sortByPredicate = config.facets[sortBy].labelPath
    }
    let sortByPattern
    if (has(config.facets[sortBy], 'orderByPattern')) {
      sortByPattern = config.facets[sortBy].orderByPattern
    } else {
      sortByPattern = `OPTIONAL { ?id ${sortByPredicate} ?orderBy }`
    }
    q = q.replace('<ORDER_BY_TRIPLE>', sortByPattern)
    q = q = q.replace('<ORDER_BY>', `ORDER BY (!BOUND(?orderBy)) ${sortDirection}(?orderBy)`)
  }
  q = q.replace(/<FACET_CLASS>/g, config.facetClass)
  q = q.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`)
  q = q.replace('<RESULT_SET_PROPERTIES>', config.paginatedResults.properties)
  if (langTag) {
    q = q.replace(/<LANG>/g, langTag)
  }
  // console.log(endpoint.prefixes + q)
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: makeObjectList,
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
  limit
}) => {
  const config = backendSearchConfig[resultClass]
  let endpoint
  let defaultConstraint = null
  let langTag = null
  if (has(config, 'perspectiveID')) {
    ({ endpoint, defaultConstraint, langTag } = backendSearchConfig[config.perspectiveID])
  } else {
    ({ endpoint, defaultConstraint, langTag } = config)
  }
  const { filterTarget, resultMapper } = config
  let { q } = config
  if (constraints == null && defaultConstraint == null) {
    q = q.replace(/<FILTER>/g, '# no filters')
  } else {
    q = q.replace(/<FILTER>/g, generateConstraintsBlock({
      backendSearchConfig,
      facetClass,
      constraints,
      defaultConstraint,
      filterTarget: filterTarget,
      facetID: null
    }))
  }
  q = q.replace(/<FACET_CLASS>/g, backendSearchConfig[config.perspectiveID].facetClass)
  if (langTag) {
    q = q.replace(/<LANG>/g, langTag)
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
  const config = backendSearchConfig[resultClass]
  let endpoint
  let defaultConstraint = null
  if (has(config, 'perspectiveID')) {
    ({ endpoint, defaultConstraint } = backendSearchConfig[config.perspectiveID])
  } else {
    ({ endpoint, defaultConstraint } = config)
  }
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
  q = q.replace(/<FACET_CLASS>/g, config.facetClass)
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
  const config = backendSearchConfig[resultClass]
  let endpoint
  let langTag = null
  if (has(config, 'perspectiveID')) {
    ({ endpoint, langTag } = backendSearchConfig[config.perspectiveID])
  } else {
    ({ endpoint, langTag } = config)
  }
  const { properties, relatedInstances } = config.instance
  let q = instanceQuery
  q = q.replace('<PROPERTIES>', properties)
  q = q.replace('<RELATED_INSTANCES>', relatedInstances)
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: 'related__id',
      facetID: null
    }))
  }
  q = q.replace('<ID>', `<${uri}>`)
  if (langTag) {
    q = q.replace(/<LANG>/g, langTag)
  }
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: makeObjectList,
    resultFormat
  })
}
