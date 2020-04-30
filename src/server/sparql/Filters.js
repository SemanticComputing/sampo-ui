import { facetConfigs } from './sampo/FacetConfigsSampo'

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
          facetClass: facetClass,
          facetID: c.facetID,
          filterTarget: filterTarget,
          queryString: c.values,
          inverse: inverse
        })
        break
      case 'uriFilter':
        filterStr += generateUriFilter({
          facetClass: facetClass,
          facetID: c.facetID,
          filterTarget: filterTarget,
          values: c.values,
          inverse: inverse
        })
        break
      case 'spatialFilter':
        filterStr += generateSpatialFilter({
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
  facetClass,
  facetID,
  filterTarget,
  queryString,
  inverse
}) => {
  const facetConfig = facetConfigs[facetClass][facetID]
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
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  const { latMin, longMin, latMax, longMax } = values
  const filterStr = `
    ?${facetID}Filter spatial:withinBox (${latMin} ${longMin} ${latMax} ${longMax} 1000000) .
    ?${filterTarget} ${facetConfigs[facetClass][facetID].predicate} ?${facetID}Filter .
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
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  const facetConfig = facetConfigs[facetClass][facetID]
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
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  const facetConfig = facetConfigs[facetClass][facetID]
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
  facetClass,
  facetID,
  filterTarget,
  values,
  inverse
}) => {
  let s = ''
  const addChildren = facetConfigs[facetClass][facetID].type === 'hierarchical'
  const literal = facetConfigs[facetClass][facetID].literal
  const valuesStr = literal ? `"${values.join('" "')}"` : `<${values.join('> <')}></$>`
  if (addChildren) {
    s = `
         VALUES ?${facetID}Filter { ${valuesStr} }
         ?${facetID}FilterWithChildren ${facetConfigs[facetClass][facetID].parentProperty}* ?${facetID}Filter .
     `
  } else {
    s = `
         VALUES ?${facetID}Filter { ${valuesStr} }
     `
  }
  if (inverse) {
    s += `
       FILTER NOT EXISTS {
         ?${filterTarget} ${facetConfigs[facetClass][facetID].predicate} ?${facetID}Filter .
         ?${filterTarget} ${facetConfigs[facetClass][facetID].predicate} ?id .
       }
     `
  } else {
    const filterValue = addChildren
      ? `?${facetID}FilterWithChildren`
      : `?${facetID}Filter`
    s += `
       ?${filterTarget} ${facetConfigs[facetClass][facetID].predicate} ${filterValue} .
     `
  }
  return s
}

export const generateSelectedFilter = ({
  facetID,
  constraints,
  inverse
}) => {
  return (`
      FILTER(?id ${inverse ? 'NOT' : ''} IN ( <${getUriFilters(constraints, facetID).join('>, <')}> ))
  `)
}
