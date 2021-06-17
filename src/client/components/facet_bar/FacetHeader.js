import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import ListSubheader from '@material-ui/core/ListSubheader'
import history from '../../History'
import ChartDialog from './ChartDialog'
import { createApexPieChartData } from '../../configs/sampo/ApexCharts/PieChartConfig'
import { createApexBarChartData } from '../../configs/sampo/ApexCharts/BarChartConfig'
import { createSingleLineChartData } from '../../configs/sampo/ApexCharts/LineChartConfig'
import PieChartIcon from '@material-ui/icons/PieChart'
import LineChartIcon from '@material-ui/icons/ShowChart'
import BarChartIcon from '@material-ui/icons/BarChart'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  headingContainer: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: '100%'
  },
  facetLabel: props => ({
    fontSize: '0.875rem',
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      fontSize: '1rem'
    }
  }),
  facetValuesContainerTen: {
    height: 345,
    padding: theme.spacing(1)
  },
  facetValuesContainerThree: {
    height: 108,
    padding: theme.spacing(1)
  },
  facetHeaderButtons: {
    marginLeft: 'auto'
  }
})

/**
 * A component for rendering a header and optional settings dropdown for a facet component.
 */
class FacetHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      anchorEl: null
    }
  }

  handleMenuButtonClick = event => {
    event.stopPropagation()
    this.setState({ anchorEl: event.currentTarget })
  };

  handleSortOnClick = buttonID => () => {
    this.setState({ anchorEl: null })
    let sortDirection
    if (buttonID === 'prefLabel') {
      if (this.props.facet.sortBy === 'instanceCount') {
        sortDirection = 'asc' // default sort direction when sorting by prefLabel
      } else {
        sortDirection = this.props.facet.sortDirection === 'asc'
          ? 'desc' : 'asc'
      }
    }
    if (buttonID === 'instanceCount') {
      if (this.props.facet.sortBy === 'prefLabel') {
        sortDirection = 'desc' // default sort direction when sorting by instanceCount
      } else {
        sortDirection = this.props.facet.sortDirection === 'asc'
          ? 'desc' : 'asc'
      }
    }
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: 'sortDirection',
      value: sortDirection
    })
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: 'sortBy',
      value: buttonID
    })
  };

  handleFilterTypeOnClick = buttonID => () => {
    this.setState({ anchorEl: null })
    if (buttonID === 'uriFilter' && this.props.facet.filterType === 'spatialFilter') {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'spatialFilter',
        value: null
      })
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'filterType',
        value: 'uriFilter'
      })
    }
    if (buttonID === 'spatialFilter' && this.props.facet.filterType === 'uriFilter') {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'filterType',
        value: 'spatialFilter'
      })
      history.push({ pathname: `${this.props.rootUrl}/${this.props.resultClass}/faceted-search/${this.props.facet.spatialFilterTab}` })
    }
  }

  handleSubconceptsOnClick = buttonID => () => {
    this.setState({ anchorEl: null })
    let selectAlsoSubconcepts
    if (buttonID === 'selectAlsoSubconcepts') {
      selectAlsoSubconcepts = true
    }
    if (buttonID === 'doNotSelectSubconcepts') {
      selectAlsoSubconcepts = false
    }
    this.props.clearFacet({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID
    })
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: 'selectAlsoSubconcepts',
      value: selectAlsoSubconcepts
    })
  };

  handleConjuctionOnClick = buttonID => () => {
    this.setState({ anchorEl: null })
    let useConjuction
    if (buttonID === 'useConjuction') {
      useConjuction = true
    }
    if (buttonID === 'useDisjunction') {
      useConjuction = false
    }
    this.props.clearFacet({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID
    })
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: 'useConjuction',
      value: useConjuction
    })
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  renderFacetMenu = () => {
    const { anchorEl } = this.state
    const {
      sortButton,
      spatialFilterButton,
      sortBy,
      filterType,
      type,
      barChartButton = false,
      pieChartButton = false,
      lineChartButton = false,
      selectAlsoSubconceptsButton = false,
      selectAlsoSubconcepts,
      useConjuctionButton = false,
      useConjuction
    } = this.props.facet
    const open = Boolean(anchorEl)
    const menuButtons = []

    if (sortButton) {
      menuButtons.push(
        <ListSubheader component='div' key='sortingOptionsSubheader'>
          {intl.get('facetBar.sortingOptions')}
        </ListSubheader>
      )
      menuButtons.push(
        <MenuItem
          key='prefLabel'
          selected={sortBy === 'prefLabel'}
          onClick={this.handleSortOnClick('prefLabel')}
        >
          {intl.get('facetBar.sortAlphabetically')}
        </MenuItem>
      )
      menuButtons.push(
        <MenuItem
          key='instanceCount'
          selected={sortBy === 'instanceCount'}
          onClick={this.handleSortOnClick('instanceCount')}
        >
          {intl.get('facetBar.sortByNumberOfSearchResults')}
        </MenuItem>
      )
    }
    if (spatialFilterButton) {
      menuButtons.push(
        <ListSubheader component='div' key='filterOptionsSubheader'>
          {intl.get('facetBar.filterOptions')}
        </ListSubheader>
      )
      menuButtons.push(
        <MenuItem
          key='uriFilter'
          selected={filterType === 'uriFilter'}
          onClick={this.handleFilterTypeOnClick('uriFilter')}
        >
          {intl.get('facetBar.filterByName')}
        </MenuItem>
      )
      menuButtons.push(
        <MenuItem
          key='spatialFilter'
          selected={filterType === 'spatialFilter'}
          onClick={this.handleFilterTypeOnClick('spatialFilter')}
        >
          {intl.get('facetBar.filterByBoundingBox')}
        </MenuItem>
      )
    }
    if (useConjuctionButton || selectAlsoSubconceptsButton) {
      menuButtons.push(
        <ListSubheader component='div' key='selectionOptionsSubheader'>
          {intl.get('facetBar.selectionOptions')}
        </ListSubheader>
      )
      if (type === 'hierarchical' && selectAlsoSubconceptsButton) {
        menuButtons.push(
          <MenuItem
            key='selectAlsoSubconcepts'
            selected={selectAlsoSubconcepts}
            onClick={this.handleSubconceptsOnClick('selectAlsoSubconcepts')}
          >
            {intl.get('facetBar.selectAlsoSubconcepts')}
          </MenuItem>
        )
        menuButtons.push(
          <MenuItem
            key='doNotSelectSubconcepts'
            selected={!selectAlsoSubconcepts}
            onClick={this.handleSubconceptsOnClick('doNotSelectSubconcepts')}
          >
            {intl.get('facetBar.doNotSelectSubconcepts')}
          </MenuItem>
        )
      }
      if (useConjuctionButton) {
        menuButtons.push(
          <MenuItem
            key='useConjuction'
            selected={useConjuction}
            onClick={this.handleConjuctionOnClick('useConjuction')}
          >
            {intl.get('facetBar.useConjuction')}
          </MenuItem>
        )
        menuButtons.push(
          <MenuItem
            key='useDisjunction'
            selected={!useConjuction}
            onClick={this.handleConjuctionOnClick('useDisjunction')}
          >
            {intl.get('facetBar.useDisjunction')}
          </MenuItem>
        )
      }
    }
    return (
      <>
        {pieChartButton &&
          <ChartDialog
            rawData={this.props.facetConstrainSelf.values}
            rawDataUpdateID={this.props.facetConstrainSelfUpdateID}
            fetching={this.props.facetConstrainSelf.isFetching}
            fetchData={this.props.fetchFacetConstrainSelf}
            createChartData={createApexPieChartData}
            facetID={this.props.facetID}
            facetClass={this.props.facetClass}
            icon={<PieChartIcon />}
            tooltip={intl.get('facetBar.pieChart.tooltip')}
            dialogTitle={this.props.facetLabel}
          />}
        {barChartButton &&
          <ChartDialog
            rawData={this.props.facetConstrainSelf.values}
            rawDataUpdateID={this.props.facetConstrainSelfUpdateID}
            fetching={this.props.facetConstrainSelf.isFetching}
            fetchData={this.props.fetchFacetConstrainSelf}
            createChartData={createApexBarChartData}
            facetID={this.props.facetID}
            facetClass={this.props.facetClass}
            icon={<BarChartIcon />}
            tooltip={intl.get('facetBar.barChart.tooltip')}
            title={intl.get(`facetBar.barChart.${this.props.facetID}.title`)}
            xaxisTitle={intl.get(`facetBar.barChart.${this.props.facetID}.xaxisTitle`)}
            yaxisTitle={intl.get(`facetBar.barChart.${this.props.facetID}.yaxisTitle`)}
            seriesTitle={intl.get(`facetBar.barChart.${this.props.facetID}.seriesTitle`)}
          />}
        {lineChartButton &&
          <ChartDialog
            rawData={this.props.facetResults.results}
            rawDataUpdateID={this.props.facetResults.resultUpdateID}
            fetching={this.props.facetResults.fetching}
            fetchData={this.props.fetchResults}
            createChartData={createSingleLineChartData}
            resultClass={`${this.props.facetID}LineChart`}
            facetClass={this.props.facetClass}
            icon={<LineChartIcon />}
            tooltip={intl.get('facetBar.lineChart.tooltip')}
            title={intl.get(`facetBar.lineChart.${this.props.facetID}.title`)}
            xaxisTitle={intl.get(`facetBar.lineChart.${this.props.facetID}.xaxisTitle`)}
            yaxisTitle={intl.get(`facetBar.lineChart.${this.props.facetID}.yaxisTitle`)}
            seriesTitle={intl.get(`facetBar.lineChart.${this.props.facetID}.seriesTitle`)}
            lineChartConfig={this.props.facet.lineChartConfig}
          />}
        {menuButtons.length > 0 &&
          <>
            <Tooltip disableFocusListener title={intl.get('facetBar.filterOptions')}>
              <IconButton
                className='facetMenuButton'
                aria-label={intl.get('facetBar.filterOptions')}
                aria-owns={open ? 'facet-option-menu' : undefined}
                aria-haspopup='true'
                onClick={this.handleMenuButtonClick}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id='facet-option-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleMenuClose}
            >
              {menuButtons}
            </Menu>
          </>}
      </>
    )
  }

  render () {
    const { classes, isActive, facetDescription, facetLabel } = this.props
    const { sortButton, spatialFilterButton, pieChartButton, lineChartButton, selectAlsoSubconceptsButton } = this.props.facet
    const showButtons = isActive &&
      (sortButton || spatialFilterButton || pieChartButton || lineChartButton || selectAlsoSubconceptsButton)

    return (
      <div className={classes.headingContainer}>
        <Typography className={classes.facetLabel} variant='body1'>{facetLabel}</Typography>
        <Tooltip
          title={facetDescription}
          enterDelay={300}
        >
          <IconButton aria-label='description'>
            <InfoIcon />
          </IconButton>
        </Tooltip>
        {showButtons &&
          <div className={classes.facetHeaderButtons}>
            {this.renderFacetMenu()}
          </div>}
      </div>
    )
  }
}

FacetHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string,
  facetLabel: PropTypes.string.isRequired,
  facet: PropTypes.object,
  facetConstrainSelf: PropTypes.object,
  facetConstrainSelfUpdateID: PropTypes.number,
  isActive: PropTypes.bool.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  fetchFacetConstrainSelf: PropTypes.func,
  fetchResults: PropTypes.func,
  facetResults: PropTypes.object,
  clearFacet: PropTypes.func,
  updateFacetOption: PropTypes.func,
  facetDescription: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export const FacetHeaderComponent = FacetHeader

export default withStyles(styles)(FacetHeader)
