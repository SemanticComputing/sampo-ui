export const hasPreviousSelections = (constraints, facetID) => {
  let hasPreviousSelections = false
  for (const [key, value] of Object.entries(constraints)) {
    if (key === facetID && value.filterType === 'uriFilter') {
      hasPreviousSelections = true
    }
  }
  return hasPreviousSelections
}

export const hasPreviousSelectionsFromOtherFacets = (constraints, facetID) => {
  for (const [key, value] of Object.entries(constraints)) {
    if (key !== facetID && value.filterType === 'uriFilter') {
      return true
    }
  }
  return false
}

export const getUriFilters = (constraints, facetID) => {
  constraints.forEach(facet => {
    if (facet.facetID === facetID && facet.filter === 'uriFilter') {
      return facet.values
    }
  })
  return []
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
          inverse: inverse
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
  const selectionStart = start
  const selectionEnd = end
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
      ?${facetID}Start >= "${selectionStart}"^^xsd:date && ?${facetID}Start <= "${selectionEnd}"^^xsd:date
      ||
      ?${facetID}End >= "${selectionStart}"^^xsd:date && ?${facetID}End <= "${selectionEnd}"^^xsd:date
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
  inverse
}) => {
  let s = ''
  const facetConfig = backendSearchConfig[facetClass].facets[facetID]
  const addChildren = facetConfig.type === 'hierarchical'
  const literal = facetConfig.literal
  const valuesStr = literal ? `"${values.join('" "')}"` : `<${values.join('> <')}></$>`
  if (addChildren) {
    s = `
         VALUES ?${facetID}Filter { ${valuesStr} }
         ?${facetID}FilterWithChildren ${facetConfig.parentProperty}* ?${facetID}Filter .
     `
  } else {
    s = `
         VALUES ?${facetID}Filter { ${valuesStr} }
     `
  }
  if (inverse) {
    s += `
       FILTER NOT EXISTS {
         ?${filterTarget} ${facetConfig.predicate} ?${facetID}Filter .
         ?${filterTarget} ${facetConfig.predicate} ?id .
       }
     `
  } else {
    const filterValue = addChildren
      ? `?${facetID}FilterWithChildren`
      : `?${facetID}Filter`
    s += `
       ?${filterTarget} ${facetConfig.predicate} ${filterValue} .
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
