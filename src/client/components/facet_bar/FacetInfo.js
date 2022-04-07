import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { has } from 'lodash'
import ActiveFilters from './ActiveFilters'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

/**
 * A component for fetching and displaying the number of results, and displaying active filters.
 */
class FacetInfo extends React.Component {
  componentDidMount = () => {
    if (this.props.facetedSearchMode === 'serverFS') {
      this.props.fetchResultCount({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass
      })
    }
  }

  componentDidUpdate = prevProps => {
    if (this.props.facetedSearchMode === 'serverFS' && prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResultCount({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass
      })
    }
  }

  handleRemoveAllFiltersOnClick = () => this.props.clearAllFacets({ facetClass: this.props.facetClass })

  getTypographyVariant = () => {
    const { screenSize } = this.props
    let variant = 'h6'
    if (screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' || screenSize === 'lg') {
      variant = 'body1'
    }
    return variant
  }

  render () {
    const { facetClass, resultClass, resultCount, someFacetIsFetching, screenSize } = this.props
    const mobileMode = screenSize === 'xs' || screenSize === 'sm'
    const { facets } = this.props.facetState
    const uriFilters = {}
    const spatialFilters = {}
    const textFilters = {}
    const timespanFilters = {}
    const dateNoTimespanFilters = {}
    const integerFilters = {}
    let activeUriFilters = false
    let activeSpatialFilters = false
    let activeTextFilters = false
    let activeTimespanFilters = false
    let activeDateNoTimespanFilters = false
    let activeIntegerFilters = false
    Object.entries(facets).forEach(entry => {
      const [key, value] = entry
      if (has(value, 'uriFilter') && value.uriFilter !== null) {
        activeUriFilters = true
        uriFilters[key] = value.uriFilter
      }
      if (has(value, 'spatialFilter') && value.spatialFilter !== null) {
        activeSpatialFilters = true
        spatialFilters[key] = value.spatialFilter._bounds
      }
      if (has(value, 'textFilter') && value.textFilter !== null) {
        activeTextFilters = true
        textFilters[key] = value.textFilter
      }
      if (has(value, 'timespanFilter') && value.timespanFilter !== null) {
        activeTimespanFilters = true
        timespanFilters[key] = value.timespanFilter
      }
      if (has(value, 'dateNoTimespanFilter') && value.dateNoTimespanFilter !== null) {
        activeDateNoTimespanFilters = true
        dateNoTimespanFilters[key] = value.dateNoTimespanFilter
      }
      if (has(value, 'integerFilter') && value.integerFilter !== null) {
        activeIntegerFilters = true
        integerFilters[key] = value.integerFilter
      }
    })
    return (
      <>
        {this.props.fetchingResultCount
          ? <CircularProgress size={26} />
          : (
            <Typography
              component='h2'
              variant={this.getTypographyVariant()}
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {intl.get('facetBar.results')}: {resultCount} {intl.get(`perspectives.${resultClass}.facetResultsType`)}
            </Typography>
            )}
        {!mobileMode &&
          <Divider
            sx={theme => ({
              marginTop: theme.spacing(0.5),
              marginBottom: theme.spacing(0.5)
            })}
          />}
        {(activeUriFilters ||
          activeSpatialFilters ||
          activeTextFilters ||
          activeTimespanFilters ||
          activeDateNoTimespanFilters ||
          activeIntegerFilters
        ) &&
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Typography component='h2' variant={this.getTypographyVariant()}>{intl.get('facetBar.activeFilters')}</Typography>
              <Button
                variant='contained'
                color='secondary'
                size='small'
                startIcon={<DeleteIcon />}
                onClick={this.handleRemoveAllFiltersOnClick}
                disabled={someFacetIsFetching}
                sx={theme => ({
                  margin: theme.spacing(1)
                })}
              >{intl.get('facetBar.removeAllFilters')}
              </Button>
            </Box>
            <ActiveFilters
              facetClass={facetClass}
              uriFilters={uriFilters}
              spatialFilters={spatialFilters}
              textFilters={textFilters}
              timespanFilters={timespanFilters}
              dateNoTimespanFilters={dateNoTimespanFilters}
              integerFilters={integerFilters}
              updateFacetOption={this.props.updateFacetOption}
              someFacetIsFetching={someFacetIsFetching}
              fetchingResultCount={this.props.fetchingResultCount}
              fetchFacet={this.props.fetchFacet}
              propertiesTranslationsID={this.props.propertiesTranslationsID}
            />
            <Divider
              sx={theme => ({
                marginTop: theme.spacing(0.5),
                marginBottom: theme.spacing(0.5)
              })}
            />
          </>}
        {!mobileMode &&
          <Typography
            component='h2'
            variant={this.getTypographyVariant()}
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            {intl.get('facetBar.narrowDownBy')}:
          </Typography>}
      </>
    )
  }
}

FacetInfo.propTypes = {
  facetedSearchMode: PropTypes.string.isRequired,
  facetUpdateID: PropTypes.number.isRequired,
  facetState: PropTypes.object.isRequired,
  facetClass: PropTypes.string.isRequired,
  resultClass: PropTypes.string.isRequired,
  resultCount: PropTypes.number,
  fetchingResultCount: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func,
  fetchResultCount: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func
}

export default FacetInfo
