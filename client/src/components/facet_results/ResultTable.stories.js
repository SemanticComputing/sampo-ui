import React from 'react'
import ResultTable, { ResultTableComponent } from './ResultTable'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default {
  component: ResultTableComponent,
  title: 'Sampo-UI/facet_results/ResultTable'
}

export const basic = () => {
  const facetResults = useSelector(state => state.perspective1)
  const location = useLocation()
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResultTable
        data={facetResults}
        facetUpdateID={0}
        resultClass='perspective1'
        facetClass='perspective1'
        fetchPaginatedResults={() => null}
        updatePage={() => null}
        updateRowsPerPage={() => null}
        sortResults={() => null}
        location={location}
        rootUrl=''
      />
    </div>
  )
}
