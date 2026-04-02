import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TextFacet } from '@sampo-ui/components'

const ExampleCustomFacet = (props) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1, backgroundColor: '#e3f2fd', borderBottom: '1px solid #90caf9' }}>
        <Typography variant='body2' color='primary'>
          Custom Component — wrapping text Facet
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <TextFacet {...props} />
      </Box>
    </Box>
  )
}

export default ExampleCustomFacet

ExampleCustomFacet.propTypes = {
  // Facet identity
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.shape({
    filterType: PropTypes.string,
    isFetching: PropTypes.bool,
    values: PropTypes.array,
    uriFilter: PropTypes.object,
    useConjunction: PropTypes.bool,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string
  }).isRequired,
  facetClass: PropTypes.string.isRequired,
  // Facet state
  facetUpdateID: PropTypes.number.isRequired,
  updatedFacet: PropTypes.string,
  updatedFilter: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
  // Fetching state
  someFacetIsFetching: PropTypes.bool.isRequired,
  fetchingResultCount: PropTypes.bool.isRequired,
  // Actions
  fetchFacet: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired
}
