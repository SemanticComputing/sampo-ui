import { has } from 'lodash'

export const generateConstraintsBlock = ({
  backendSearchConfig,
  facetClass,
  constraints,
  filterTarget,
  facetID,
  inverse,
  constrainSelf = false,
  filterTripleFirst = false,
  defaultConstraint = null
}) => {
  let filterStr = ''
  if (constraints !== null) {
    const skipFacetID = constrainSelf ? '' : facetID
    const modifiedConstraints = constraints.filter(facet => facet.facetID !== skipFacetID)
    modifiedConstraints.sort((a, b) => a.priority - b.priority)
    modifiedConstraints.forEach(c => {
      switch (c.filterType) {
        case 'textFilter':
          filterStr += generateTextFilter({
            backendSearchConfig,
            facetClass: facetClass,
            facetID: c.facetID,
            filterTarget: filterTarget,
            queryString: c.values,
            inverse: inverse
          })
          break
        case 'uriFilter':
          filterStr += generateUriFilter({
            backendSearchConfig,
            facetClass: facetClass,
            facetID: c.facetID,
            filterTarget: filterTarget,
            values: c.values,
            inverse: inverse,
            filterTripleFirst,
            selectAlsoSubconcepts: Object.prototype.hasOwnProperty.call(c, 'selectAlsoSubconcepts')
              ? c.selectAlsoSubconcepts
              : true, // default behaviour for hierarchical facets, can be controlled via reducers
            useConjuction: c.useConjuction
          })
          break
        case 'spatialFilter':
          filterStr += generateSpatialFilter({
            backendSearchConfig,
            facetClass: facetClass,
            facetID: c.facetID,
            filterTarget: filterTarget,
            values: c.values,
            inverse: inverse
          })
          break
        case 'timespanFilter':
        case 'dateFilter':
          filterStr += generateTimespanFilter({
            backendSearchConfig,
            facetClass: facetClass,
            facetID: c.facetID,
            filterTarget: filterTarget,
            values: c.values,
            inverse: inverse
          })
          break
        case 'dateNoTimespanFilter':
          filterStr += generateDateNoTimespanFilter({
            backendSearchConfig,
            facetClass: facetClass,
            facetID: c.facetID,
            filterTarget: filterTarget,
            values: c.values,
            inverse: inverse
          })
          break
        case 'integerFilter':
        case 'integerFilterRange':
          filterStr += generateIntegerFilter({
            backendSearchConfig,
            facetClass: facetClass,
            facetID: c.facetID,
            filterTarget: filterTarget,
            values: c.values,
            inverse: inverse
          })
          break
      }
    })
  }
  if (defaultConstraint !== null) {
    const defaultConstraintTriple = defaultConstraint.replace('<SUBJECT>', `?${filterTarget}`)
    filterStr += defaultConstraintTriple
  }
  return filterStr
}

const generateTextFilter = ({
  backendSearchConfig,
  facetClass,
  facetID,
  filterTarget,
  queryString,
  inverse
}) => {
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const queryTargetVariable = facetConfig.textQueryPredicate
    ? '?textQueryTarget'
    : `?${filterTarget}`
  const querySubject = facetConfig.textQueryGetLiteral
    ? `( ${queryTargetVariable} ?score ?literal )`
    : queryTargetVariable
  let queryObject = ''
  let textQueryMaxInstances = ''
  if (facetConfig.textQueryMaxInstances) {
    textQueryMaxInstances = facetConfig.textQueryMaxInstances
  }
  if (has(facetConfig, 'textQueryProperty') && facetConfig.textQueryGetLiteral &&
      has(facetConfig, 'textQueryHiglightingOptions')) {
    queryObject = `( ${facetConfig.textQueryProperty} '${queryString}' ${textQueryMaxInstances} "${facetConfig.textQueryHiglightingOptions}" )`
  }
  if (!has(facetConfig, 'textQueryProperty') && facetConfig.textQueryGetLiteral &&
       has(facetConfig, 'textQueryHiglightingOptions')) {
    queryObject = `( '${queryString}' ${textQueryMaxInstances} "${facetConfig.textQueryHiglightingOptions}" )`
  }
  if (has(facetConfig, 'textQueryProperty') && !facetConfig.textQueryGetLiteral &&
       !has(facetConfig, 'textQueryHiglightingOptions')) {
    queryObject = `( ${facetConfig.textQueryProperty} '${queryString}' ${textQueryMaxInstances})`
  }
  if (!has(facetConfig, 'textQueryProperty') && !facetConfig.textQueryGetLiteral &&
       !has(facetConfig, 'textQueryHiglightingOptions')) {
    queryObject = `'${queryString}' ${textQueryMaxInstances}`
  }
  const filterStr = facetConfig.textQueryPredicate
    ? `${queryTargetVariable} text:query ${queryObject} .
    ?${filterTarget} ${facetConfig.textQueryPredicate} ${queryTargetVariable} .`
    : `${querySubject} text:query ${queryObject} .`
  if (inverse) {
    return `
      FILTER NOT EXISTS {
        ${filterStr}
        ?instance ?predicate ?id . 
      }
    `
  } else {
    return filterStr
  }
}

const generateSpatialFilter = ({
  backendSearchConfig,
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  const { latMin, longMin, latMax, longMax } = values
  const filterStr = `
    ?${facetID}Filter spatial:withinBox (${latMin} ${longMin} ${latMax} ${longMax} 1000000) .
    ?${filterTarget} ${backendSearchConfig[facetClass].facets[facetID].predicate} ?${facetID}Filter .
  `
  if (inverse) {
    return `
      FILTER NOT EXISTS {
        ${filterStr}
      }
    `
  } else {
    return filterStr
  }
}

const generateTimespanFilter = ({
  backendSearchConfig,
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const { start, end } = values
  let selectionStart = start
  let selectionEnd = end
  const dataType = has(facetConfig, 'dataType') ? facetConfig.dataType : 'xsd:date'
  if (dataType === 'xsd:dateTime') {
    selectionStart = `${selectionStart}T00:00:00Z`
    selectionEnd = `${selectionEnd}T00:00:00Z`
  }
  const filterStr = `
    ?${filterTarget} ${facetConfig.predicate} ?tspan .
    ?tspan ${facetConfig.startProperty} ?startA ;
           ${facetConfig.endProperty} ?endA .       
    BIND("${selectionStart}"^^${dataType} as ?startB)
    BIND("${selectionEnd}"^^${dataType} as ?endB)      
    # Determine whether two date ranges overlap: https://stackoverflow.com/a/325964/6028835
    # Also make sure that starts and ends are in right order in the RDF data.
    FILTER(
      (?startA <= ?endB) && (?endA >= ?startB) && (?startA <= ?endA)
    )
    # Alternative, stricter implementation:
    # Determine whether range B (facet selection) is entirely within range A (timespan in RDF data).
    # Also make sure that starts and ends are in right order in the RDF data.
    # FILTER(
    #  (?startA >= ?startB) && (?endA <= ?endB) && (?startA <= ?endA)
    # )
  `
  if (inverse) {
    return `
    FILTER NOT EXISTS {
        ${filterStr}
    }
    `
  } else {
    return filterStr
  }
}

const generateIntegerFilter = ({
  backendSearchConfig,
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const { start, end } = values
  const typecasting = facetConfig.typecasting
    ? facetConfig.typecasting
    : 'BIND(xsd:integer(?value) as ?valueAsInteger)'
  let integerFilter = ''
  if (start === '') {
    integerFilter = `?valueAsInteger <= ${end}`
  } else if (end === '') {
    integerFilter = `?valueAsInteger >= ${start}`
  } else {
    integerFilter = `?valueAsInteger >= ${start} && ?valueAsInteger <= ${end}`
  }
  const filterStr = `
    ?${filterTarget} ${facetConfig.predicate} ?value .
    ${typecasting}
    FILTER(
      ${integerFilter}
    )
  `
  if (inverse) {
    return `
    FILTER NOT EXISTS {
        ${filterStr}
    }
    `
  } else {
    return filterStr
  }
}

const generateDateNoTimespanFilter = ({
  backendSearchConfig,
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const { start, end } = values
  let datefilter = ''
  if (start === '') {
    datefilter = `?value <= "${end}"^^xsd:date`
  } else if (end === '') {
    datefilter = `?value >= "${start}"^^xsd:date`
  } else {
    datefilter = `?value >= "${start}"^^xsd:date && ?value <= "${end}"^^xsd:date`
  }
  const filterStr = `
    ?${filterTarget} ${facetConfig.predicate} ?value .
    FILTER(
      ${datefilter}
    )
  `
  if (inverse) {
    return `
    FILTER NOT EXISTS {
        ${filterStr}
    }
    `
  } else {
    return filterStr
  }
}

const generateUriFilter = ({
  backendSearchConfig,
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse,
  selectAlsoSubconcepts,
  filterTripleFirst,
  useConjuction
}) => {
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const includeChildren = facetConfig.facetType === 'hierarchical' && selectAlsoSubconcepts
  const { literal, predicate, parentProperty } = facetConfig
  const { modifiedValues, indexOfUnknown } = handleUnknownValue(values)
  let s
  if (modifiedValues.length > 0) {
    const valuesStr = generateValuesForUriFilter({ values: modifiedValues, literal, useConjuction })
    s = useConjuction
      ? generateConjuctionForUriFilter({
          facetID,
          predicate,
          parentProperty,
          filterTarget,
          inverse,
          includeChildren,
          valuesStr
        })
      : generateDisjunctionForUriFilter({
        facetID,
        predicate,
        parentProperty,
        filterTarget,
        inverse,
        filterTripleFirst,
        includeChildren,
        valuesStr
      })
  }
  // TODO: how to handle 'http://ldf.fi/MISSING_VALUE' in inverse setting?
  if (!inverse && modifiedValues.length > 0 && indexOfUnknown !== -1) {
    s = `
    {
      ${s}
    }
    UNION 
    {
      ${generateMissingValueBlock({ predicate, filterTarget })}
    }
    `
  }
  if (!inverse && modifiedValues.length === 0 && indexOfUnknown !== -1) {
    s = `
      ${generateMissingValueBlock({ predicate, filterTarget })}
    `
  }
  return s
}

export const handleUnknownValue = values => {
  const modifiedValues = [...values]
  const indexOfUnknown = values.indexOf('http://ldf.fi/MISSING_VALUE')
  if (indexOfUnknown !== -1) {
    modifiedValues.splice(indexOfUnknown, 1)
  }
  return {
    indexOfUnknown,
    modifiedValues
  }
}

const generateMissingValueBlock = ({ predicate, filterTarget }) => {
  return ` 
    VALUES ?facetClass { <FACET_CLASS> }
    ?${filterTarget} <FACET_CLASS_PREDICATE> ?facetClass .
    FILTER NOT EXISTS {
      ?${filterTarget} ${predicate} [] .
    }
  `
}

const generateValuesForUriFilter = ({ values, literal, useConjuction }) => {
  let str = ''
  if (literal && useConjuction) {
    str = `"${values.join('", "')}" .`
  }
  if (!literal && useConjuction) {
    str = `<${values.join('>, <')}> .`
  }
  if (literal && !useConjuction) {
    str = `"${values.join('" "')}" `
  }
  if (!literal && !useConjuction) {
    str = `<${values.join('> <')}> `
  }
  return str
}

const generateDisjunctionForUriFilter = ({
  facetID,
  predicate,
  parentProperty,
  filterTarget,
  inverse,
  filterTripleFirst,
  includeChildren,
  valuesStr
}) => {
  let s = ''
  const predicateModified = includeChildren
    ? `${predicate}/${parentProperty}*`
    : predicate
  const filterTriple = `?${filterTarget} ${predicateModified} ?${facetID}Filter .`
  if (filterTripleFirst) {
    s += `
    VALUES ?${facetID}Filter { ${valuesStr} }
    `
    s += filterTriple
  }
  if (inverse) {
    s += `
       FILTER NOT EXISTS {
        ?${filterTarget} ?randomPredicate ?id .
         ${filterTriple}
       }
     `
  }
  if (!inverse && !filterTripleFirst) {
    s += `
    VALUES ?${facetID}Filter { ${valuesStr} }
    `
    s += filterTriple
  }
  return s
}

const generateConjuctionForUriFilter = ({
  facetID,
  predicate,
  parentProperty,
  filterTarget,
  inverse,
  includeChildren,
  valuesStr
}) => {
  const predicateModified = includeChildren
    ? `${predicate}/${parentProperty}*`
    : predicate
  if (inverse) {
    return `
        FILTER NOT EXISTS {
          ?${filterTarget} ?randomPredicate ?id .
          ?${filterTarget} ${predicate} ${valuesStr}
        }
      `
  } else {
    return `?${filterTarget} ${predicateModified} ${valuesStr}`
  }
}
