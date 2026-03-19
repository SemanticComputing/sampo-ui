import React, { useEffect } from 'react'

const MyCustomComponent = ({
  data,
  resultClass,
  facetClass,
  facetUpdateID,
  fetchPaginatedResults,
  updatePage
}) => {
  useEffect(() => {
    // Mirror ResultTable: set page to 0 if it's -1, then let the
    // page change trigger the fetch via the second useEffect
    const page = data.page === -1 ? 0 : data.page
    updatePage(resultClass, page)
  }, [])

  useEffect(() => {
    // This fires when page changes (including the initial updatePage above)
    // Mirror ResultTable.fetchResults
    fetchPaginatedResults(resultClass, facetClass, data.sortBy)
  }, [data.page, facetUpdateID])

  const { paginatedResults, fetching } = data

  if (fetching) return <div>Loading...</div>
  if (!paginatedResults?.length) return <div>No results</div>

  return (
    <div>
      <h2>My Custom Component</h2>
      <ul>
        {paginatedResults.map(item => (
          <li key={item.id}>{item.prefLabel.prefLabel ?? item.id}</li>
        ))}
      </ul>
    </div>
  )
}

export default MyCustomComponent
