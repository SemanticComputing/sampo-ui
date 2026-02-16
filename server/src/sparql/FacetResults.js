import { has } from 'lodash'
import { runSelectQuery } from './SparqlApi'
import { runNetworkQuery } from './NetworkApi'
import { makeObjectList, mapCount } from './Mappers'
import { generateConstraintsBlock } from './Filters'

export const getPaginatedResults = ({
  backendSearchConfig,
  resultClass,
  page,
  pagesize,
  constraints,
  sortBy,
  sortDirection,
  resultFormat,
  dynamicLangTag
}) => {
  const perspectiveConfig = backendSearchConfig[resultClass]
  let q = perspectiveConfig.generalQueries.facetResultSetQuery
  const {
    endpoint,
    facets,
    facetClass,
    enableDynamicLanguageChange,
    defaultConstraint = null,
    langTagSecondary = null
  } = perspectiveConfig
  const langTag = enableDynamicLanguageChange ? dynamicLangTag : perspectiveConfig.langTag || null
  const resultClassConfig = perspectiveConfig.resultClasses[resultClass]
  const {
    propertiesQueryBlock,
    filterTarget = 'id',
    resultMapper = makeObjectList,
    resultMapperConfig = null,
    postprocess = null
  } = resultClassConfig.paginatedResultsConfig
  if (constraints == null && defaultConstraint == null) {
    q = q.replaceAll('<FILTER>', '# no filters')
  } else {
    q = q.replaceAll('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      facetClass: resultClass, // use resultClass as facetClass
      constraints,
      defaultConstraint,
      filterTarget,
      facetID: null
    }))
  }
  if (sortBy == null) {
    q = q.replaceAll('<ORDER_BY_TRIPLE>', '')
    q = q.replaceAll('<ORDER_BY>', '# no sorting')
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
    q = q.replaceAll('<ORDER_BY_TRIPLE>', sortByPattern)
    q = q = q.replaceAll('<ORDER_BY>', `ORDER BY (!BOUND(?orderBy)) ${sortDirection}(?orderBy)`)
  }
  q = q.replaceAll(/<FACET_CLASS>/g, facetClass)
  if (has(backendSearchConfig[resultClass], 'facetClassPredicate')) {
    q = q.replaceAll(/<FACET_CLASS_PREDICATE>/g, backendSearchConfig[resultClass].facetClassPredicate)
  } else {
    q = q.replaceAll(/<FACET_CLASS_PREDICATE>/g, 'a')
  }
  q = q.replaceAll('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`)
  q = q.replaceAll('<RESULT_SET_PROPERTIES>', propertiesQueryBlock)
  if (langTag) {
    q = q.replaceAll(/<LANG>/g, langTag)
  }
  if (langTagSecondary) {
    q = q.replaceAll(/<LANG_SECONDARY>/g, langTagSecondary)
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
  perspectiveID = null,
  resultClass,
  facetClass,
  uri,
  constraints,
  resultFormat,
  optimize,
  limit,
  fromID = null,
  toID = null,
  period = null,
  province = null,
  dynamicLangTag
}) => {
  const finalPerspectiveID = perspectiveID || facetClass
  const perspectiveConfig = backendSearchConfig[finalPerspectiveID]
  if (perspectiveConfig === undefined) {
    console.log(`Error: config not found for perspective "${finalPerspectiveID}"`)
    return Promise.resolve({
      data: null,
      sparqlQuery: ''
    })
  }
  const {
    endpoint,
    defaultConstraint = null,
    langTagSecondary = null,
    enableDynamicLanguageChange
  } = perspectiveConfig
  const langTag = enableDynamicLanguageChange ? dynamicLangTag : perspectiveConfig.langTag || null
  const resultClassConfig = perspectiveConfig.resultClasses[resultClass]
  if (resultClassConfig === undefined) {
    console.log(`Error: result class "${resultClass}" not defined for perspective "${finalPerspectiveID}"`)
    return Promise.resolve({
      data: null,
      sparqlQuery: ''
    })
  }
  const {
    sparqlQuery,
    sparqlQueryNodes = null,
    property = null,
    rdfType = null,
    filterTarget = 'id',
    resultMapper = makeObjectList,
    resultMapperConfig = null,
    postprocess = null
  } = resultClassConfig
  let q = sparqlQuery
  if (constraints == null && defaultConstraint == null) {
    q = q.replaceAll(/<FILTER>/g, '# no filters')
  } else {
    q = q.replaceAll(/<FILTER>/g, generateConstraintsBlock({
      backendSearchConfig,
      facetClass,
      constraints,
      defaultConstraint,
      filterTarget,
      facetID: null
    }))
  }
  q = q.replaceAll(/<FACET_CLASS>/g, perspectiveConfig.facetClass)
  if (has(backendSearchConfig[resultClass], 'facetClassPredicate')) {
    q = q.replaceAll(/<FACET_CLASS_PREDICATE>/g, backendSearchConfig[resultClass].facetClassPredicate)
  } else {
    q = q.replaceAll(/<FACET_CLASS_PREDICATE>/g, 'a')
  }
  if (langTag) {
    q = q.replaceAll(/<LANG>/g, langTag)
  }
  if (langTagSecondary) {
    q = q.replaceAll(/<LANG_SECONDARY>/g, langTagSecondary)
  }
  if (fromID) {
    q = q.replaceAll(/<FROM_ID>/g, `<${fromID}>`)
  }
  if (toID) {
    q = q.replaceAll(/<TO_ID>/g, `<${toID}>`)
  }
  if (period) {
    q = q.replaceAll(/<PERIOD>/g, `<${period}>`)
  }
  if (province) {
    q = q.replaceAll(/<PROVINCE>/g, `<${province}>`)
  }
  if (property) {
    q = q.replaceAll(/<PROPERTY>/g, property)
  }
  if (rdfType) {
    q = q.replaceAll(/<RDF_TYPE>/g, rdfType)
  }
  if (resultClassConfig.useNetworkAPI) {
    return runNetworkQuery({
      endpoint: endpoint.url,
      prefixes: endpoint.prefixes,
      id: uri,
      links: q,
      nodes: sparqlQueryNodes,
      optimize,
      limit,
      queryType: resultClassConfig.queryType
    })
  } else {
    if (uri !== null) {
      q = q.replaceAll(/<ID>/g, `<${uri}>`)
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
  const perspectiveConfig = backendSearchConfig[resultClass]
  let q = perspectiveConfig.generalQueries.countQuery
  const {
    endpoint,
    defaultConstraint = null
  } = perspectiveConfig
  if (constraints == null && defaultConstraint == null) {
    q = q.replaceAll('<FILTER>', '# no filters')
  } else {
    q = q.replaceAll('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      facetClass: resultClass, // use resultClass as facetClass
      constraints,
      defaultConstraint,
      filterTarget: 'id',
      facetID: null,
      filterTripleFirst: true
    }))
  }
  q = q.replaceAll(/<FACET_CLASS>/g, perspectiveConfig.facetClass)
  if (has(backendSearchConfig[resultClass], 'facetClassPredicate')) {
    q = q.replaceAll(/<FACET_CLASS_PREDICATE>/g, backendSearchConfig[resultClass].facetClassPredicate)
  } else {
    q = q.replaceAll(/<FACET_CLASS_PREDICATE>/g, 'a')
  }

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
  perspectiveID = null,
  resultClass,
  facetClass,
  constraints,
  uri,
  resultFormat,
  dynamicLangTag
}) => {
  let perspectiveConfig
  if (perspectiveID) {
    perspectiveConfig = backendSearchConfig[perspectiveID]
  } else {
    perspectiveConfig = backendSearchConfig[facetClass]
  }
  const {
    endpoint,
    langTagSecondary = null,
    enableDynamicLanguageChange
  } = perspectiveConfig
  const langTag = enableDynamicLanguageChange ? dynamicLangTag : perspectiveConfig.langTag || null
  const resultClassConfig = perspectiveConfig.resultClasses[resultClass]
  const {
    propertiesQueryBlock,
    filterTarget = 'related__id',
    relatedInstances = '',
    noFilterForRelatedInstances = false,
    resultMapper = makeObjectList,
    resultMapperConfig = null,
    postprocess = null
  } = resultClassConfig.instanceConfig
  let q = perspectiveConfig.generalQueries.instanceQuery
  q = q.replaceAll('<PROPERTIES>', propertiesQueryBlock)
  q = q.replaceAll('<RELATED_INSTANCES>', relatedInstances)
  if (constraints == null || noFilterForRelatedInstances) {
    q = q.replaceAll('<FILTER>', '# no filters')
  } else {
    q = q.replaceAll('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget,
      facetID: null
    }))
  }
  q = q.replaceAll(/<ID>/g, `<${uri}>`)
  if (langTag) {
    q = q.replaceAll(/<LANG>/g, langTag)
  }
  if (langTagSecondary) {
    q = q.replaceAll(/<LANG_SECONDARY>/g, langTagSecondary)
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
