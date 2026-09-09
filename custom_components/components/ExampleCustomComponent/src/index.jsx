import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ResultTable } from '@sampo-ui/components'

const ExampleCustomComponent = (props) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1, backgroundColor: '#e3f2fd', borderBottom: '1px solid #90caf9' }}>
        <Typography variant='body2' color='primary'>
          Custom Component — wrapping ResultTable
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <ResultTable {...props} />
      </Box>
    </Box>
  )
}

export default ExampleCustomComponent

ExampleCustomComponent.propTypes = {
  data: PropTypes.object.isRequired,
  results: PropTypes.array,
  fetching: PropTypes.bool,
  // Identity
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
  // Config
  portalConfig: PropTypes.object,
  layoutConfig: PropTypes.object,
  perspectiveConfig: PropTypes.object,
  resultClassConfig: PropTypes.object,
  // Facet state
  facetState: PropTypes.object,
  facetUpdateID: PropTypes.number.isRequired,
  // UI
  screenSize: PropTypes.string,
  location: PropTypes.object,
  currentLocale: PropTypes.string,
  // Actions
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchResults: PropTypes.func,
  fetchByURI: PropTypes.func,
  fetchFacet: PropTypes.func,
  fetchInstanceAnalysis: PropTypes.func,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func,
  updateFacetOption: PropTypes.func,
  sortResults: PropTypes.func.isRequired,
  showError: PropTypes.func
}
