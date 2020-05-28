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
  state = {
    anchorEl: null
  };

  handleMenuButtonClick = event => {
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
      chartButton = false,
      selectAlsoSubconceptsButton = false,
      selectAlsoSubconcepts
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
    if (type === 'hierarchical' && selectAlsoSubconceptsButton) {
      menuButtons.push(
        <ListSubheader component='div' key='selectionOptionsSubheader'>
          {intl.get('facetBar.selectionOptions')}
        </ListSubheader>
      )
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
    return (
      <>
        {chartButton &&
          <ChartDialog
            data={this.props.facetConstrainSelf.values}
            fetching={this.props.facetConstrainSelf.isFetching}
            facetID={this.props.facetID}
            facetClass={this.props.facetClass}
            fetchFacetConstrainSelf={this.props.fetchFacetConstrainSelf}
          />}
        <Tooltip disableFocusListener title='Filter options'>
          <IconButton
            aria-label='Filter options'
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
      </>
    )
  }

  render () {
    const { classes, isActive, facetDescription, facetLabel } = this.props
    const { sortButton, spatialFilterButton, chartButton, selectAlsoSubconceptsButton } = this.props.facet
    const showButtons = isActive && (sortButton || spatialFilterButton || chartButton || selectAlsoSubconceptsButton)

    return (
      <div className={classes.headingContainer}>
        <Typography variant='body1'>{facetLabel} </Typography>
        <Tooltip
          title={facetDescription}
          enterDelay={300}
        >
          <IconButton>
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
  isActive: PropTypes.bool.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  fetchFacetConstrainSelf: PropTypes.func,
  clearFacet: PropTypes.func,
  updateFacetOption: PropTypes.func,
  facetDescription: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export const FacetHeaderComponent = FacetHeader

export default withStyles(styles)(FacetHeader)
