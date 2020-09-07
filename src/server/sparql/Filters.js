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
  constrainSelf = false
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
          selectAlsoSubconcepts: Object.prototype.hasOwnProperty.call(c, 'selectAlsoSubconcepts')
            ? c.selectAlsoSubconcepts : true // default behaviour for hierarchical facets, can be controlled via reducers
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
  selectAlsoSubconcepts
}) => {
  let s = ''
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const includeChildren = facetConfig.type === 'hierarchical' && selectAlsoSubconcepts
  const literal = facetConfig.literal
  const valuesStr = literal ? `"${values.join('" "')}"` : `<${values.join('> <')}>`
  if (inverse) {
    s += `
       FILTER NOT EXISTS {
         ?${filterTarget} ${facetConfig.predicate} ?${facetID}Filter .
         ?${filterTarget} ${facetConfig.predicate} ?id .
       }
     `
  } else {
    const filterValue = includeChildren
      ? `?${facetID}FilterWithChildren`
      : `?${facetID}Filter`
    s += `
       ?${filterTarget} ${facetConfig.predicate} ${filterValue} .
     `
  }
  if (includeChildren) {
    s += `
        VALUES ?${facetID}Filter { ${valuesStr} }
        ?${facetID}FilterWithChildren ${facetConfig.parentProperty}* ?${facetID}Filter .
     `
  } else {
    s += `
        VALUES ?${facetID}Filter { ${valuesStr} }
     `
  }
  return s
}

export const generateSelectedFilter = ({
  backendSearchConfig,
  facetID,
  constraints,
  inverse
}) => {
  return (`
          FILTER(?id ${inverse ? 'NOT' : ''} IN ( <${getUriFilters(constraints, facetID).join('>, <')}> ))
  `)
}
