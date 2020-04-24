import { createSelector } from 'reselect'
import { orderBy, has } from 'lodash'

// https://redux.js.org/recipes/computing-derived-data

const getFacets = state => state.facets
const getLastlyUpdatedFacet = state => state.lastlyUpdatedFacet
const getResults = state => state.results
const getSortBy = state => state.sortBy
const getSortDirection = state => state.sortDirection

export const filterResults = createSelector(
  [getResults, getFacets, getLastlyUpdatedFacet, getSortBy, getSortDirection],
  (results, facets, lastlyUpdatedFacet, sortBy, sortDirection) => {
    // Filter results by current facet selections
    Object.values(facets).forEach(facet => {
      const { facetID, filterType } = facet
      if (filterType === 'clientFSLiteral' && facet.selectionsSet.size !== 0) {
        results = results.filter(result => facet.selectionsSet.has(result[facetID]))
      }
    })
    results = orderBy(results, sortBy, sortDirection)

    // Calculate values for all facets
    const facetValues = {}
    let skipFacetID = ''
    // Initialize the facetValues object with facet IDs
    for (const facetId in facets) {
      facetValues[facetId] = {}
    }
    // If a facet selection was added, first handle that facet
    if (lastlyUpdatedFacet !== null) {
      // console.log(lastlyUpdatedFacet.facetID)
      // console.log(facets[lastlyUpdatedFacet.facetID])
      skipFacetID = lastlyUpdatedFacet.facetID
      lastlyUpdatedFacet.values = lastlyUpdatedFacet.values.map(value => ({
        ...value,
        selected: facets[lastlyUpdatedFacet.facetID].selectionsSet.has(value.id)
      }))
      facetValues[lastlyUpdatedFacet.facetID] = lastlyUpdatedFacet.values
    }
    // Then handle all the remainder facets
    for (const result of results) {
      Object.values(facets).forEach(facet => {
        const { facetID, filterType, selectionsSet } = facet
        if (facetID !== skipFacetID && filterType === 'clientFSLiteral' && has(result, facetID)) {
          const literalValue = result[facetID]
          if (!has(facetValues[facetID], literalValue)) {
            facetValues[facetID][literalValue] = {
              id: literalValue,
              prefLabel: literalValue,
              selected: selectionsSet.has(literalValue),
              instanceCount: 1,
              parent: null
            }
          } else {
            facetValues[facetID][literalValue].instanceCount += 1
          }
        }
      })
    }
    for (const facetID in facetValues) {
      facetValues[facetID] = orderBy(facetValues[facetID], 'prefLabel')
    }
    // console.log(results)
    // console.log(facetValues)
    return {
      clientFSResults: results,
      clientFSFacetValues: facetValues
    }
  }
)
