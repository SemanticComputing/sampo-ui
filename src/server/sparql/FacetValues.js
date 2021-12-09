import { runSelectQuery } from './SparqlApi'
import { has } from 'lodash'
import {
  facetValuesQuery,
  facetValuesQueryTimespan,
  facetValuesRange
} from './SparqlQueriesGeneral'
import {
  generateConstraintsBlock,
  handleUnknownValue
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
  sortBy = null,
  sortDirection = null,
  constraints,
  resultFormat,
  constrainSelf
}) => {
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const { endpoint, defaultConstraint = null, langTag = null } = backendSearchConfig[facetClass]
  // choose query template and result mapper:
  let q = ''
  let mapper = null
  switch (facetConfig.facetType) {
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
  let filterBlock
  let unknownSelected = 'false'
  let currentSelectionsWithoutUnknown = []
  if (constraints == null && defaultConstraint == null) {
    filterBlock = '# no filters'
  } else {
    filterBlock = generateConstraintsBlock({
      backendSearchConfig,
      facetClass,
      constraints,
      defaultConstraint,
      filterTarget: 'instance',
      facetID,
      inverse: false,
      constrainSelf // facet does not constrain itself by default
    })
  }
  if (constraints) {
    const currentSelections = getUriFilters(constraints, facetID)
    // if <http://ldf.fi/MISSING_VALUE> is selected, it needs special care
    const { indexOfUnknown, modifiedValues } = handleUnknownValue(currentSelections)
    currentSelectionsWithoutUnknown = modifiedValues
    const previousSelectionsExist = hasPreviousSelections(constraints, facetID)
    const previousSelectionsFromOtherFacetsExist = hasPreviousSelectionsFromOtherFacets(constraints, facetID)
    if (indexOfUnknown !== -1) {
      unknownSelected = 'true'
    }
    /* if this facet has previous selections (exluding <http://ldf.fi/MISSING_VALUE>),
       they need to be binded as selected */
    if (currentSelectionsWithoutUnknown.length > 0 && hasPreviousSelections) {
      selectedBlock = generateSelectedBlock({ currentSelectionsWithoutUnknown, literal: facetConfig.literal })
    }
    /* if there is previous selections in this facet AND in some other facet, we need an
        additional block for facet values that return 0 hits */
    if (previousSelectionsExist && previousSelectionsFromOtherFacetsExist && currentSelectionsWithoutUnknown.length > 0) {
      selectedNoHitsBlock = generateSelectedNoHitsBlock({
        backendSearchConfig,
        facetClass,
        facetID,
        constraints,
        // no defaultConstraint here
        currentSelectionsWithoutUnknown,
        literal: facetConfig.literal
      })
    }
  }
  if (facetConfig.hideUnknownValue) {
    q = q.replace(/<UNKNOWN_VALUES>/g, '')
  } else {
    q = q.replace(/<UNKNOWN_VALUES>/g, unknownBlock)
  }
  q = q.replace('<SELECTED_VALUES>', selectedBlock)
  q = q.replace('<SELECTED_VALUES_NO_HITS>', selectedNoHitsBlock)
  q = q.replace(/<FACET_VALUE_FILTER>/g, facetConfig.facetValueFilter ? facetConfig.facetValueFilter : '')
  q = q.replace(/<FACET_LABEL_FILTER>/g,
    has(facetConfig, 'facetLabelFilter')
      ? facetConfig.facetLabelFilter
      : ''
  )
  if (facetConfig.facetType === 'hierarchical') {
    q = q.replace('<ORDER_BY>', '# no need for ordering')
    q = q.replace(/<PREDICATE>/g, `${facetConfig.predicate}/${facetConfig.parentProperty}*`)
    q = q.replace('<PARENTS>', `
            OPTIONAL { ?id ${facetConfig.parentProperty} ?parent_ }
            BIND(COALESCE(?parent_, '0') as ?parent)
    `)
  } else {
    q = q.replace('<ORDER_BY>', `ORDER BY ${sortDirection}(?${sortBy})`)
    q = q.replace(/<PREDICATE>/g, facetConfig.predicate)
    q = q.replace('<PARENTS>', ' # no parents')
  }
  q = q.replace(/<FILTER>/g, filterBlock)
  q = q.replace(/<FACET_CLASS>/g, backendSearchConfig[facetClass].facetClass)
  q = q.replace('<UNKNOWN_SELECTED>', unknownSelected)
  q = q.replace('<MISSING_PREDICATE>', facetConfig.predicate)
  if (has(facetConfig, 'labelPattern')) {
    q = q.replace('<LABELS>', facetConfig.labelPattern)
  } else {
    const defaultLabelPattern = `
     OPTIONAL {
         ?id <FACET_LABEL_PREDICATE> ?prefLabel_
         <FACET_LABEL_FILTER>
       }
     BIND(COALESCE(STR(?prefLabel_), STR(?id)) AS ?prefLabel)
    `
    q = q.replace('<LABELS>', defaultLabelPattern)
    const facetLabelPredicate = facetConfig.facetLabelPredicate
      ? facetConfig.facetLabelPredicate
      : 'skos:prefLabel'
    q = q.replace('<FACET_LABEL_PREDICATE>', facetLabelPredicate)
    q = q.replace(/<FACET_LABEL_FILTER>/g,
      has(facetConfig, 'facetLabelFilter')
        ? facetConfig.facetLabelFilter
        : ''
    )
  }
  if (facetConfig.facetType === 'timespan') {
    q = q.replace('<START_PROPERTY>', facetConfig.startProperty)
    q = q.replace('<END_PROPERTY>', facetConfig.endProperty)
  }
  if (langTag) {
    q = q.replace(/<LANG>/g, langTag)
  }
  // if (facetID === 'productionPlace') {
  //   console.log(endpoint.prefixes + q)
  // }
  const response = await runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: mapper,
    resultMapperConfig: facetConfig,
    resultFormat
  })
  if (facetConfig.facetType === 'hierarchical') {
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
  currentSelectionsWithoutUnknown,
  literal
}) => {
  const selectedFilter = generateSelectedFilter({
    currentSelectionsWithoutUnknown,
    inverse: false,
    literal
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
  constraints,
  currentSelectionsWithoutUnknown,
  literal
}) => {
  const noHitsFilter = generateConstraintsBlock({
    backendSearchConfig,
    facetClass,
    constraints,
    filterTarget: 'instance',
    facetID: facetID,
    inverse: true
  })
  const selections = literal ? `'${currentSelectionsWithoutUnknown.join(' ')}'` : `<${currentSelectionsWithoutUnknown.join('> <')}>`
  return `
  UNION
  # facet values that have been selected but return no results
  {
    VALUES ?id { ${selections} }
    ${noHitsFilter}
    BIND(true AS ?selected_)
  }
    `
}

const hasPreviousSelections = (constraints, facetID) => {
  let hasPreviousSelections = false
  constraints.forEach(facet => {
    if (facet.facetID === facetID && facet.filterType === 'uriFilter') {
      hasPreviousSelections = true
    }
  })
  return hasPreviousSelections
}

const hasPreviousSelectionsFromOtherFacets = (constraints, facetID) => {
  let hasPreviousSelectionsFromOtherFacets = false
  constraints.forEach(facet => {
    if (facet.facetID !== facetID && facet.filterType === 'uriFilter') {
      const unknownAsOnlySelection = facet.values.length === 1 && facet.values[0] === 'http://ldf.fi/MISSING_VALUE'
      if (!unknownAsOnlySelection) {
        hasPreviousSelectionsFromOtherFacets = true
      }
    }
  })
  return hasPreviousSelectionsFromOtherFacets
}

const getUriFilters = (constraints, facetID) => {
  let filters = []
  constraints.forEach(facet => {
    if (facet.facetID === facetID && facet.filterType === 'uriFilter') {
      filters = facet.values
    }
  })
  return filters
}

export const generateSelectedFilter = ({
  currentSelectionsWithoutUnknown,
  inverse,
  literal
}) => {
  const selections = literal ? `'${currentSelectionsWithoutUnknown.join(', ')}'` : `<${currentSelectionsWithoutUnknown.join('>, <')}>`
  return (`
          FILTER(?id ${inverse ? 'NOT' : ''} IN ( ${selections} ))
  `)
}

const unknownBlock = `
  UNION
  {
    # 'Unknown' facet value for results with no predicate path
    {
      SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) {
        <FILTER>
        VALUES ?facetClass { <FACET_CLASS> }
        ?instance a ?facetClass .
        FILTER NOT EXISTS {
          ?instance <MISSING_PREDICATE> [] .
        }
      }
    }
    FILTER(?instanceCount > 0)
    BIND(IRI("http://ldf.fi/MISSING_VALUE") AS ?id)
    # prefLabel for <http://ldf.fi/MISSING_VALUE> is given in client/translations
    BIND('0' as ?parent)
    BIND(<UNKNOWN_SELECTED> as ?selected)
  }
`
