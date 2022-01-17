import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { has } from 'lodash'
import withStyles from '@mui/styles/withStyles';
import ActiveFilters from './ActiveFilters'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { purple } from '@mui/material/colors';

const styles = theme => ({
  facetInfoDivider: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5)
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    margin: theme.spacing(1)
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: '1rem'
  }
})

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
    const { classes, facetClass, resultClass, resultCount, someFacetIsFetching, screenSize } = this.props
    const mobileMode = screenSize === 'xs' || screenSize === 'sm'
    const { facets } = this.props.facetData
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
      <div className={classes.root}>
        {this.props.fetchingResultCount
          ? <CircularProgress style={{ color: purple[500] }} thickness={5} size={26} />
          : <Typography component='h2' className={classes.infoText} variant={this.getTypographyVariant()}>{intl.get('facetBar.results')}: {resultCount} {intl.get(`perspectives.${resultClass}.facetResultsType`)}</Typography>}
        {!mobileMode && <Divider className={classes.facetInfoDivider} />}
        {(activeUriFilters ||
          activeSpatialFilters ||
          activeTextFilters ||
          activeTimespanFilters ||
          activeDateNoTimespanFilters ||
          activeIntegerFilters
        ) &&
          <>
            <div className={classes.headerContainer}>
              <Typography component='h2' variant={this.getTypographyVariant()}>{intl.get('facetBar.activeFilters')}</Typography>
              <Button
                variant='contained'
                color='secondary'
                size='small'
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick={this.handleRemoveAllFiltersOnClick}
                disabled={someFacetIsFetching}
              >{intl.get('facetBar.removeAllFilters')}
              </Button>
            </div>
            <div className={classes.textContainer}>
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
              />
            </div>
            <Divider className={classes.facetInfoDivider} />
          </>}
        {!mobileMode && <Typography component='h2' className={classes.infoText} variant={this.getTypographyVariant()}>{intl.get('facetBar.narrowDownBy')}:</Typography>}
      </div>
    )
  }
}

FacetInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  facetedSearchMode: PropTypes.string.isRequired,
  facetUpdateID: PropTypes.number.isRequired,
  facetData: PropTypes.object.isRequired,
  facetClass: PropTypes.string.isRequired,
  resultClass: PropTypes.string.isRequired,
  resultCount: PropTypes.number,
  fetchingResultCount: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func,
  fetchResultCount: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func
}

export const FacetInfoComponent = FacetInfo

export default withStyles(styles)(FacetInfo)
