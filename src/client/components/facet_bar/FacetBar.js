import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { withStyles } from '@material-ui/core/styles'
import HierarchicalFacet from './HierarchicalFacet'
import TextFacet from './TextFacet'
import SliderFacet from './SliderFacet'
import RangeFacet from './RangeFacet'
import DateFacet from './DateFacet'
import Paper from '@material-ui/core/Paper'
import FacetHeader from './FacetHeader'
import FacetInfo from './FacetInfo'
import DatasetSelector from './DatasetSelector'
import SearchField from './SearchField'
import LeafletMapDialog from './LeafletMapDialog'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import clsx from 'clsx'

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
  expansionPanelSummaryRoot: {
    paddingLeft: theme.spacing(1),
    cursor: 'default !important'
  },
  expansionPanelSummaryContent: {
    margin: 0
  },
  expansionPanelDetails: {
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

  handleExpandButtonOnClick = facetID => () => {
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
    const facet = facets[facetID]
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
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
            dataType='ISOString'
          />
        )
        break
      case 'dateFilter':
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
      <ExpansionPanel
        key={facetID}
        expanded={isActive}
      >
        <ExpansionPanelSummary
          classes={{
            root: classes.expansionPanelSummaryRoot,
            content: classes.expansionPanelSummaryContent
          }}
          expandIcon={<ExpandMoreIcon />}
          IconButtonProps={{ onClick: this.handleExpandButtonOnClick(facetID) }}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <FacetHeader
            facetID={facetID}
            facetLabel={label}
            facet={facet}
            facetConstrainSelf={facetConstrainSelf}
            facetConstrainSelfUpdateID={this.props.facetDataConstrainSelf
              ? this.props.facetDataConstrainSelf.facetUpdateID : null}
            isActive={isActive}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            fetchFacet={this.props.fetchFacet}
            fetchFacetConstrainSelf={this.props.fetchFacetConstrainSelf}
            fetchResults={this.props.fetchResults}
            facetResults={this.props.facetResults}
            clearFacet={this.props.clearFacet}
            updateFacetOption={this.props.updateFacetOption}
            facetDescription={description}
            rootUrl={this.props.rootUrl}
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          className={clsx(classes[facet.containerClass], classes.expansionPanelDetails)}
        >
          {isActive && facetComponent}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }

  render () {
    const { classes, facetClass, resultClass, resultCount, facetData, facetedSearchMode } = this.props
    const { facets } = facetData
    let someFacetIsFetching = false
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
            map={this.props.leafletMap}
            clientFSFetchResults={this.props.clientFSFetchResults}
            clientFSClearResults={this.props.clientFSClearResults}
            updateMapBounds={this.props.updateMapBounds}
            fetching={this.props.clientFS.spatialResultsFetching}
            showError={this.props.showError}
            perspectiveID={facetClass}
          />}
        {(facetedSearchMode === 'serverFS' || facetData.results !== null) &&
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
            />
          </Paper>}
        {facets && Object.keys(facets).map(facetID => {
          if (facetID !== 'datasetSelector') {
            return this.renderFacet(facetID, someFacetIsFetching)
          }
        })}
      </div>
    )
  }
}

FacetBar.propTypes = {
  classes: PropTypes.object.isRequired,
  facetedSearchMode: PropTypes.string.isRequired,
  facetData: PropTypes.object.isRequired,
  facetDataConstrainSelf: PropTypes.object,
  facetResults: PropTypes.object,
  facetClass: PropTypes.string.isRequired,
  resultClass: PropTypes.string.isRequired,
  resultCount: PropTypes.number.isRequired,
  fetchingResultCount: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func,
  fetchFacetConstrainSelf: PropTypes.func,
  fetchResults: PropTypes.func,
  clearFacet: PropTypes.func,
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
  showError: PropTypes.func,
  rootUrl: PropTypes.string.isRequired
}

export const FacetBarComponent = FacetBar

export default withStyles(styles)(FacetBar)
