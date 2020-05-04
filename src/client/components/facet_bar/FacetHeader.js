import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/InfoOutlined'
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

class FacetHeader extends React.Component {
  state = {
    anchorEl: null
  };

  handleMenuButtonClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleSortOnClick = buttonID => () => {
    this.setState({ anchorEl: null })
    if (buttonID === 'prefLabel' && this.props.facet.sortBy === 'instanceCount') {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'sortBy',
        value: 'prefLabel'
      })
    }
    if (buttonID === 'instanceCount' && this.props.facet.sortBy === 'prefLabel') {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'sortDirection',
        value: 'desc'
      })
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'sortBy',
        value: 'instanceCount'
      })
    }
  };

  handleFilterTypeOnClick = buttonID => () => {
    // console.log(event.target)
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

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  renderFacetMenu = () => {
    const { anchorEl } = this.state
    const { sortButton, spatialFilterButton, sortBy, filterType, chartButton = false } = this.props.facet
    const open = Boolean(anchorEl)
    const menuButtons = []
    if (sortButton) {
      menuButtons.push({
        id: 'prefLabel',
        menuItemText: 'Sort alphabetically',
        selected: sortBy === 'prefLabel',
        onClickHandler: this.handleSortOnClick
      })
      menuButtons.push({
        id: 'instanceCount',
        menuItemText: `Sort by number of ${this.props.resultClass}`,
        selected: sortBy === 'instanceCount',
        onClickHandler: this.handleSortOnClick
      })
    }
    if (spatialFilterButton) {
      menuButtons.push({
        id: 'uriFilter',
        menuItemText: 'Filter by name',
        selected: filterType === 'uriFilter',
        onClickHandler: this.handleFilterTypeOnClick
      })
      menuButtons.push({
        id: 'spatialFilter',
        menuItemText: 'Filter by bounding box',
        selected: filterType === 'spatialFilter',
        onClickHandler: this.handleFilterTypeOnClick
      })
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
          {menuButtons.map(button => (
            <MenuItem key={button.id} selected={button.selected} onClick={button.onClickHandler(button.id)}>
              {button.menuItemText}
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  }

  render () {
    const { classes, isActive, facetDescription, facetLabel } = this.props
    const { sortButton, spatialFilterButton, chartButton } = this.props.facet
    const showButtons = isActive && (sortButton || spatialFilterButton || chartButton)

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
  updateFacetOption: PropTypes.func,
  facetDescription: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default withStyles(styles)(FacetHeader)
