import { has } from 'lodash'

export const hasPreviousSelections = (constraints, facetID) => {
  let hasPreviousSelections = false
  constraints.map(facet => {
    if (facet.facetID === facetID && facet.filterType === 'uriFilter') {
      hasPreviousSelections = true
    }
  })
  return hasPreviousSelections
}

export const hasPreviousSelectionsFromOtherFacets = (constraints, facetID) => {
  let hasPreviousSelectionsFromOtherFacets = false
  constraints.map(facet => {
    if (facet.facetID !== facetID && facet.filterType === 'uriFilter') {
      hasPreviousSelectionsFromOtherFacets = true
    }
  })
  return hasPreviousSelectionsFromOtherFacets
}

export const getUriFilters = (constraints, facetID) => {
  let filters = []
  constraints.map(facet => {
    if (facet.facetID === facetID && facet.filterType === 'uriFilter') {
      filters = facet.values
    }
  })
  return filters
}

export const generateConstraintsBlock = ({
  backendSearchConfig,
  facetClass,
  constraints,
  filterTarget,
  facetID,
  inverse,
  constrainSelf = false,
  filterTripleFirst = false
}) => {
  let filterStr = ''
  const skipFacetID = constrainSelf ? '' : facetID
  const modifiedConstraints = constraints.filter(facet => facet.facetID !== skipFacetID)
  modifiedConstraints.sort((a, b) => a.priority - b.priority)
  modifiedConstraints.map(c => {
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
            ? c.selectAlsoSubconcepts : true, // default behaviour for hierarchical facets, can be controlled via reducers
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
  let filterStr = ''
  if (facetConfig.textQueryPredicate === '') {
    filterStr = `?${filterTarget} text:query (${facetConfig.textQueryProperty} '${queryString}') .`
  } else {
    filterStr = `
      ?textQueryTarget text:query (${facetConfig.textQueryProperty} '${queryString}') .
      ?${filterTarget} ${facetConfig.textQueryPredicate} ?textQueryTarget .

    `
  }
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
  // return `
  //   ?${filterTarget} ${facetConfig.predicate} ?timespan .
  //   ?timespan ${facetConfig.startProperty} ?start .
  //   ?timespan ${facetConfig.endProperty} ?end .
  //   # both start and end is in selected range
  //   FILTER(?start >= "${start}"^^xsd:date)
  //   FILTER(?end <= "${end}"^^xsd:date)
  // `;
  const filterStr = `
    ?${filterTarget} ${facetConfig.predicate} ?${facetID} .
    ?${facetID} ${facetConfig.startProperty} ?${facetID}Start .
    ?${facetID} ${facetConfig.endProperty} ?${facetID}End .
    # either start or end is in selected range
    FILTER(
      ?${facetID}Start >= "${selectionStart}"^^${dataType} && ?${facetID}Start <= "${selectionEnd}"^^${dataType}
      ||
      ?${facetID}End >= "${selectionStart}"^^${dataType} && ?${facetID}End <= "${selectionEnd}"^^${dataType}
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
  let integerFilter = ''
  if (start === '') {
    integerFilter = `xsd:integer(?value) <= ${end}`
  } else if (end === '') {
    integerFilter = `xsd:integer(?value) >= ${start}`
  } else {
    integerFilter = `xsd:integer(?value) >= ${start} && xsd:integer(?value) <= ${end}`
  }
  const filterStr = `
    ?${filterTarget} ${facetConfig.predicate} ?value .
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
  const includeChildren = facetConfig.type === 'hierarchical' && selectAlsoSubconcepts
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
  if (modifiedValues.length > 0 && indexOfUnknown !== -1) {
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
  if (modifiedValues.length === 0 && indexOfUnknown !== -1) {
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
    ?${filterTarget} a ?facetClass .
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
  const filterValue = includeChildren
    ? `?${facetID}FilterWithChildren`
    : `?${facetID}Filter`
  const filterTriple = `?${filterTarget} ${predicate} ${filterValue} .`
  if (filterTripleFirst) {
    s += filterTriple
  }
  if (includeChildren) {
    s += `
        VALUES ?${facetID}Filter { ${valuesStr} }
        ?${facetID}FilterWithChildren ${parentProperty}* ?${facetID}Filter .
     `
  } else {
    s += `
    VALUES ?${facetID}Filter { ${valuesStr} }
    `
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

export const generateSelectedFilter = ({
  currentSelectionsWithoutUnknown,
  inverse
}) => {
  return (`
          FILTER(?id ${inverse ? 'NOT' : ''} IN ( <${currentSelectionsWithoutUnknown.join('>, <')}> ))
  `)
}
