import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import withStyles from '@mui/styles/withStyles'
import HierarchicalFacet from './HierarchicalFacet'
import TextFacet from './TextFacet'
import SliderFacet from './SliderFacet'
import RangeFacet from './RangeFacet'
import DateFacet from './DateFacet'
import Paper from '@mui/material/Paper'
import FacetHeader from './FacetHeader'
import FacetInfo from './FacetInfo'
import DatasetSelector from './DatasetSelector'
import SearchField from './SearchField'
import LeafletMapDialog from './LeafletMapDialog'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import { has } from 'lodash'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  facetInfoContainer: {
    padding: theme.spacing(1),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  accordionSummaryRoot: props => ({
    paddingLeft: theme.spacing(1),
    cursor: 'default !important',
    minHeight: 38,
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      minHeight: 48
    }
  }),
  accordionSummaryContent: {
    margin: 0
  },
  accordionDetails: {
    paddingTop: 0,
    paddingLeft: theme.spacing(1),
    flexDirection: 'column'
  },
  two: {
    height: 60
  },
  three: {
    height: 108
  },
  four: {
    height: 135
  },
  five: {
    height: 150
  },
  six: {
    height: 180
  },
  ten: {
    height: 357
  }
})

/**
 * A component for rendering a preconfigured set of facets and related information.
 */
class FacetBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeFacets: this.props.defaultActiveFacets
    }
  }

  handleExpandButtonOnClick = facetID => event => {
    const activeFacets = this.state.activeFacets
    if (activeFacets.has(facetID)) {
      activeFacets.delete(facetID)
    } else {
      activeFacets.add(facetID)
    }
    this.setState({ activeFacets })
  }

  renderFacet = (facetID, someFacetIsFetching) => {
    const { classes, facetClass } = this.props
    const { facetUpdateID, updatedFacet, updatedFilter, facets } = this.props.facetData
    const label = intl.get(`perspectives.${facetClass}.properties.${facetID}.label`)
    const description = intl.get(`perspectives.${facetClass}.properties.${facetID}.description`)
    const facet = { ...facets[facetID] }
    const facetConstrainSelf = this.props.facetDataConstrainSelf == null
      ? null
      : this.props.facetDataConstrainSelf.facets[facetID]
    let facetComponent = null
    const isActive = this.state.activeFacets.has(facetID)
    if (this.props.facetedSearchMode === 'clientFS' && facetID !== 'datasetSelector') {
      if (this.props.facetData.results == null) {
        // do not render facets when there are no results
        return null
      } else {
        // integrate the facet values which have been calculated with a Redux selector
        facet.values = this.props.clientFSFacetValues[facetID]
      }
    }
    switch (facet.filterType) {
      case 'uriFilter':
      case 'spatialFilter':
        facetComponent = (
          <HierarchicalFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            updatedFacet={updatedFacet}
            updatedFilter={updatedFilter}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
          />
        )
        break
      case 'clientFSLiteral':
        // console.log(someFacetIsFetching)
        facetComponent = (
          <HierarchicalFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            clientFSUpdateFacet={this.props.clientFSUpdateFacet}
            someFacetIsFetching={someFacetIsFetching}
            facetedSearchMode='clientFS'
          />
        )
        break
      case 'textFilter':
        facetComponent = (
          <TextFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
          />
        )
        break
      case 'timespanFilter':
        facetComponent = (
          <SliderFacet
            facetID={facetID}
            facet={facet}
            facetFilter={facet.timespanFilter}
            facetLabel={label}
            facetClass={this.props.facetClass}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
            showError={this.props.showError}
            dataType='ISOString'
            minLabel={intl.get('facetBar.minYear')}
            maxLabel={intl.get('facetBar.maxYear')}
          />
        )
        break
      case 'dateFilter':
      case 'dateNoTimespanFilter':
        facetComponent = (
          <DateFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
          />
        )
        break
      case 'integerFilter':
        facetComponent = (
          <SliderFacet
            facetID={facetID}
            facet={facet}
            facetFilter={facet.integerFilter}
            facetLabel={label}
            facetClass={this.props.facetClass}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
            showError={this.props.showError}
            dataType='integer'
            minLabel={intl.get('facetBar.min')}
            maxLabel={intl.get('facetBar.max')}
          />
        )
        break
      case 'integerFilterRange':
        facetComponent = (
          <RangeFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
            dataType='integer'
          />
        )
        break
      case 'datasetSelector':
        facetComponent = (
          <DatasetSelector
            datasets={this.props.facetData.datasets}
            clientFSToggleDataset={this.props.clientFSToggleDataset}
            perspectiveID={this.props.facetClass}
          />
        )
        break
      default:
        facetComponent = (
          <HierarchicalFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            updatedFacet={updatedFacet}
            updatedFilter={updatedFilter}
            fetchFacet={this.props.fetchFacet}
            updateFacetOption={this.props.updateFacetOption}
          />
        )
        break
    }
    return (
      <Accordion
        key={facetID}
        expanded={isActive}
      >
        <AccordionSummary
          classes={{
            root: classes.accordionSummaryRoot,
            content: classes.accordionSummaryContent
          }}
          expandIcon={<ExpandMoreIcon />}
          // IconButtonProps={{ onClick: this.handleExpandButtonOnClick(facetID) }}
          aria-controls={`${facetID}-content`}
          id={`${facetID}-header`}
        >
          <FacetHeader
            portalConfig={this.props.portalConfig}
            perspectiveConfig={this.props.perspectiveConfig}
            facetID={facetID}
            facetLabel={label}
            facet={facet}
            facetConstrainSelf={facetConstrainSelf}
            facetConstrainSelfUpdateID={this.props.facetDataConstrainSelf
              ? this.props.facetDataConstrainSelf.facetUpdateID
              : null}
            isActive={isActive}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            perspectiveState={this.props.perspectiveState}
            fetchFacet={this.props.fetchFacet}
            fetchFacetConstrainSelf={this.props.fetchFacetConstrainSelf}
            fetchResults={this.props.fetchResults}
            clearFacet={this.props.clearFacet}
            updateFacetOption={this.props.updateFacetOption}
            facetDescription={description}
            rootUrl={this.props.rootUrl}
            layoutConfig={this.props.layoutConfig}
            mapBoxAccessToken={this.props.mapBoxAccessToken}
            mapBoxStyle={this.props.mapBoxStyle}
            apexChartsConfig={this.props.apexChartsConfig}
            leafletConfig={this.props.leafletConfig}
            networkConfig={this.props.networkConfig}
          />
        </AccordionSummary>
        <AccordionDetails
          className={clsx(classes[facet.containerClass], classes.accordionDetails)}
        >
          {isActive && facetComponent}
        </AccordionDetails>
      </Accordion>
    )
  }

  getTypographyVariant = () => {
    const { screenSize } = this.props
    let variant = 'h6'
    if (screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md') {
      variant = 'subtitle2'
    }
    return variant
  }

  renderFacets = ({ classes, facets, someFacetIsFetching }) => {
    const { screenSize } = this.props
    if (screenSize === 'xs' || screenSize === 'sm') {
      return (
        <Accordion>
          <AccordionSummary
            classes={{
              root: classes.accordionSummaryRoot,
              content: classes.accordionSummaryContent
            }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography variant={this.getTypographyVariant()}>{intl.get('facetBar.filters')}</Typography>
          </AccordionSummary>
          <AccordionDetails
            className={classes.accordionDetails}
          />
          {facets && Object.keys(facets).map(facetID => {
            if (facetID === 'datasetSelector') { return null }
            if (!has(facets[facetID], 'filterType')) { return null }
            return this.renderFacet(facetID, someFacetIsFetching)
          })}
        </Accordion>
      )
    } else {
      return (
        <>
          {facets && Object.keys(facets).map(facetID => {
            if (facetID === 'datasetSelector') { return null }
            if (!has(facets[facetID], 'filterType')) { return null }
            return this.renderFacet(facetID, someFacetIsFetching)
          })}
        </>
      )
    }
  }

  render () {
    const { classes, facetClass, resultClass, resultCount, facetData, facetedSearchMode } = this.props
    const { facets } = facetData
    let someFacetIsFetching = false
    const hasClientFSResults = facetData.results !== null
    if (facetedSearchMode === 'serverFS') {
      Object.values(facets).forEach(facet => {
        if (facet.isFetching) {
          someFacetIsFetching = true
        }
      })
    }

    return (
      <div className={classes.root}>
        {facetedSearchMode === 'clientFS' && this.renderFacet('datasetSelector', false)}
        {facetedSearchMode === 'clientFS' &&
          <SearchField
            search={this.props.facetData}
            fetchResults={this.props.clientFSFetchResults}
            clearResults={this.props.clientFSClearResults}
            updateQuery={this.props.clientFSUpdateQuery}
            datasets={this.props.facetData.datasets}
            perspectiveID={facetClass}
          />}
        {facetedSearchMode === 'clientFS' &&
          <LeafletMapDialog
            portalConfig={this.props.portalConfig}
            clientFSState={this.props.clientFSState}
            clientFSFetchResults={this.props.clientFSFetchResults}
            clientFSClearResults={this.props.clientFSClearResults}
            updateMapBounds={this.props.updateMapBounds}
            showError={this.props.showError}
            perspectiveID={facetClass}
            layoutConfig={this.props.layoutConfig}
            leafletConfig={this.props.leafletConfig}
          />}
        {(facetedSearchMode === 'serverFS' || hasClientFSResults) &&
          <Paper className={classes.facetInfoContainer}>
            <FacetInfo
              facetedSearchMode={facetedSearchMode}
              facetUpdateID={facetData.facetUpdateID}
              facetData={facetData}
              facetClass={facetClass}
              resultClass={resultClass}
              resultCount={resultCount}
              fetchingResultCount={this.props.fetchingResultCount}
              updateFacetOption={this.props.updateFacetOption}
              fetchResultCount={this.props.fetchResultCount}
              someFacetIsFetching={someFacetIsFetching}
              fetchFacet={this.props.fetchFacet}
              perspectiveID={facetClass}
              clearAllFacets={this.props.clearAllFacets}
              screenSize={this.props.screenSize}
            />
          </Paper>}
        {(facetedSearchMode === 'serverFS' || hasClientFSResults) &&
          this.renderFacets({ classes, facets, someFacetIsFetching })}
      </div>
    )
  }
}

FacetBar.propTypes = {
  classes: PropTypes.object.isRequired,
  facetedSearchMode: PropTypes.string.isRequired,
  facetData: PropTypes.object.isRequired,
  facetDataConstrainSelf: PropTypes.object,
  perspectiveState: PropTypes.object,
  facetClass: PropTypes.string.isRequired,
  resultClass: PropTypes.string.isRequired,
  resultCount: PropTypes.number,
  fetchingResultCount: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func,
  fetchFacetConstrainSelf: PropTypes.func,
  fetchResults: PropTypes.func,
  clearFacet: PropTypes.func,
  clearAllFacets: PropTypes.func,
  fetchResultCount: PropTypes.func,
  updateFacetOption: PropTypes.func,
  updateMapBounds: PropTypes.func,
  clientFS: PropTypes.object,
  clientFSFacetValues: PropTypes.object,
  clientFSToggleDataset: PropTypes.func,
  clientFSFetchResults: PropTypes.func,
  clientFSClearResults: PropTypes.func,
  clientFSUpdateQuery: PropTypes.func,
  clientFSUpdateFacet: PropTypes.func,
  defaultActiveFacets: PropTypes.instanceOf(Set).isRequired,
  leafletMap: PropTypes.object,
  showError: PropTypes.func.isRequired,
  rootUrl: PropTypes.string.isRequired,
  screenSize: PropTypes.string.isRequired
}

export const FacetBarComponent = FacetBar

export default withStyles(styles)(FacetBar)
