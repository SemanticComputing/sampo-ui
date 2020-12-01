import React, { Component } from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { withStyles } from '@material-ui/core/styles'
import { has } from 'lodash'
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree'
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CircularProgress from '@material-ui/core/CircularProgress'
import purple from '@material-ui/core/colors/purple'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import Typography from '@material-ui/core/Typography'

const styles = () => ({
  facetSearchContainer: {
    width: '100%',
    height: 44,
    display: 'flex',
    alignItems: 'center'
  },
  facetSearchIconButton: {
    padding: 10
  },
  treeContainer: {
    flex: 1
  },
  treeContainerWithSearchField: {
    width: '100%',
    flex: 1
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkbox: {
    padding: 0,
    marginLeft: 6,
    marginRight: 4
  },
  searchMatch: {
    boxShadow: '0 2px 0 #673ab7'
  },
  facetLink: {
    textDecoration: 'inherit'
  }
})

/**
 * A component for checkbox facets with or without hierarchy.
 * Based on https://github.com/frontend-collective/react-sortable-tree
 */
class HierarchicalFacet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      treeData: this.props.facetedSearchMode === 'clientFS' || this.props.facetedSearchMode === 'storybook'
        ? this.props.facet.values : [],
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      matches: []
    }
  }

  componentDidMount = () => {
    // console.log(`${this.props.facetID} mounted`);
    if (this.props.facet.filterType === 'uriFilter') {
      this.props.fetchFacet({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID
      })
    }
  }

  componentDidUpdate = prevProps => {
    // console.log(this.props.facetedSearchMode)
    // console.log(this.props)
    this.props.facetedSearchMode === 'clientFS'
      ? this.clientFScomponentDidUpdate(prevProps) : this.serverFScomponentDidUpdate(prevProps)
  }

  clientFScomponentDidUpdate = prevProps => {
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.setState({ treeData: this.props.facet.values })
    }
  }

  serverFScomponentDidUpdate = prevProps => {
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      // update component state if the user modified this facet
      if (!this.props.facet.useConjuction && this.props.updatedFacet === this.props.facetID) {
        if (has(this.props.updatedFilter, 'path')) {
          const treeObj = this.props.updatedFilter
          const newTreeData = changeNodeAtPath({
            treeData: this.state.treeData,
            getNodeKey: ({ treeIndex }) => treeIndex,
            path: treeObj.path,
            newNode: () => {
              const oldNode = treeObj.node
              if (has(oldNode, 'children')) {
                return {
                  ...oldNode,
                  selected: treeObj.added ? 'true' : 'false',
                  // select also children by default if 'selectAlsoSubconcepts' is not defined
                  ...((!Object.prototype.hasOwnProperty.call(this.props.facet, 'selectAlsoSubconcepts') || this.props.facet.selectAlsoSubconcepts) &&
                  { children: this.recursiveSelect(oldNode.children, treeObj.added) })
                }
              } else {
                return {
                  ...oldNode,
                  selected: treeObj.added ? 'true' : 'false'
                }
              }
            }
          })
          this.setState({ treeData: newTreeData })
        }
      } else { // else fetch new values, because some other facet was updated
        // console.log(`fetching new values for ${this.props.facetID}`)
        this.props.fetchFacet({
          facetClass: this.props.facetClass,
          facetID: this.props.facetID,
          constrainSelf: this.props.facet.useConjuction
        })
      }
    }

    // fetch new values if the user changes the filter type or sort order
    if (prevProps.facet.filterType !== this.props.facet.filterType &&
      this.props.facet.filterType === 'uriFilter') {
      this.props.fetchFacet({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID
      })
    }
    if (prevProps.facet.sortBy !== this.props.facet.sortBy || prevProps.facet.sortDirection !== this.props.facet.sortDirection) {
      this.props.fetchFacet({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID
      })
    }

    // when values have been fetched, update component's state
    if (prevProps.facet.values !== this.props.facet.values) {
      this.setState({
        treeData: this.props.facet.values
      })
    }
  }

  recursiveSelect = (nodes, selected) => {
    nodes.forEach(node => {
      // if a child has been previously selected, remove it
      if (has(this.props.facet.uriFilter, node.id)) {
        this.props.updateFacetOption({
          facetClass: this.props.facetClass,
          facetID: this.props.facetID,
          option: this.props.facet.filterType,
          value: { node }
        })
      }
      node.selected = selected ? 'true' : 'false'
      node.disabled = selected ? 'true' : 'false'
      if (has(node, 'children')) {
        this.recursiveSelect(node.children, selected)
      }
    })
    return nodes
  };

  handleCheckboxChange = treeObj => event => {
    if (this.props.facetedSearchMode === 'clientFS') {
      // const newTreeData = changeNodeAtPath({
      //   treeData: this.state.treeData,
      //   getNodeKey: ({ treeIndex }) => treeIndex,
      //   path: treeObj.path,
      //   newNode: {
      //     ...treeObj.node,
      //     selected: event.target.checked
      //   }
      // })
      // this.setState({ treeData: newTreeData })
      this.props.clientFSUpdateFacet({
        facetID: this.props.facetID,
        value: treeObj.node.prefLabel,
        latestValues: this.props.facet.values
      })
    } else {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: this.props.facet.filterType,
        value: treeObj
      })
    }
  }

  handleSearchFieldOnChange = event => {
    this.setState({ searchString: event.target.value })
  }

  generateNodeProps = treeObj => {
    // const { uriFilter } = this.props.facet
    const { node } = treeObj
    // const selectedCount = uriFilter == null ? 0 : Object.keys(this.props.facet.uriFilter).length
    let isSelected
    if (this.props.facetedSearchMode === 'clientFS') {
      isSelected = this.props.facet.selectionsSet.has(node.id)
    } else {
      isSelected = node.selected === 'true'
    }
    return {
      title: (
        <FormControlLabel
          control={
            <Checkbox
              className={this.props.classes.checkbox}
              checked={isSelected}
              disabled={
                /* non-hierarchical facet:
                prevent selecting values with 0 hits (which may appear based on earlier selections): */
                (this.props.facet.type !== 'hierarchical' &&
                node.instanceCount === 0 &&
                node.selected === 'false') ||
                // prevent selecting unknown value:
                // node.id === 'http://ldf.fi/MISSING_VALUE' ||
                // prevent selecting when another facet is still updating:
                this.props.someFacetIsFetching ||
                // prevent selecting all facet values when there is a logical OR between the selections:
                // (!this.props.facet.useConjuction && !isSelected && selectedCount >= this.props.facet.distinctValueCount - 1) ||
                // prevent selecting when parent has been selected
                node.disabled === 'true'
              }
              onChange={this.handleCheckboxChange(treeObj)}
              value={treeObj.node.id}
              color='primary'
            />
          }
          label={this.generateLabel(treeObj.node)}
        />
      )
    }
  };

  generateLabel = node => {
    const count = node.totalInstanceCount == null || node.totalInstanceCount === 0 ? node.instanceCount : node.totalInstanceCount
    let isSearchMatch = false
    if (this.state.matches.length > 0) {
      isSearchMatch = this.state.matches.some(match => match.node.id === node.id)
    }
    if (node.id === 'http://ldf.fi/MISSING_VALUE') {
      // Check if there is a translated label for missing value, or use defaults
      node.prefLabel = intl.get(`perspectives.${this.props.facetClass}.properties.${this.props.facetID}.missingValueLabel`) ||
        intl.get('facetBar.defaultMissingValueLabel') || 'Unknown'
    }
    return (
      <>
        <Typography className={isSearchMatch ? this.props.classes.searchMatch : ''} variant='body2'>
          {node.prefLabel}
          <span> [{count}]</span>
        </Typography>
      </>
    )
  }

  render () {
    const { searchString, searchFocusIndex, searchFoundCount } = this.state
    const { classes, facet, facetClass, facetID } = this.props
    const { isFetching, searchField } = facet

    // Case insensitive search of `node.title`
    const customSearchMethod = ({ node, searchQuery }) => {
      const prefLabel = Array.isArray(node.prefLabel) ? node.prefLabel[0] : node.prefLabel
      return searchQuery.length > 2 &&
      prefLabel.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
    }

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1
      })

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0
      })

    return (
      <>
        {isFetching ? (
          <div className={classes.spinnerContainer}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>
        ) : (
          <>
            {searchField && facet.filterType !== 'spatialFilter' &&
              <div className={classes.facetSearchContainer}>
                <Input
                  placeholder='Search...'
                  onChange={this.handleSearchFieldOnChange}
                  value={this.state.searchString}
                />
                {searchFoundCount > 0 &&
                  <>
                    <IconButton
                      className={classes.facetSearchIconButton}
                      aria-label='Previous'
                      onClick={selectPrevMatch}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton
                      className={classes.facetSearchIconButton}
                      aria-label='Next'
                      onClick={selectNextMatch}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                    <Typography>
                      {searchFoundCount > 0 ? searchFocusIndex + 1 : 0} / {searchFoundCount || 0}
                    </Typography>
                  </>}
              </div>}
            {facet.filterType !== 'spatialFilter' &&
              <div className={searchField ? classes.treeContainerWithSearchField : classes.treeContainer}>
                <SortableTree
                  treeData={this.state.treeData}
                  onChange={treeData => this.setState({ treeData })}
                  canDrag={false}
                  rowHeight={30}
                  searchMethod={customSearchMethod}
                  searchQuery={searchString}
                  searchFocusOffset={searchFocusIndex}
                  searchFinishCallback={matches => {
                    this.setState({
                      searchFoundCount: matches.length,
                      searchFocusIndex:
                          matches.length > 0 ? searchFocusIndex % matches.length : 0,
                      matches
                    })
                  }}
                  onlyExpandSearchedNodes
                  theme={FileExplorerTheme}
                  generateNodeProps={this.generateNodeProps}
                  isVirtualized={this.props.facetedSearchMode !== 'storybook'} // virtualization does not work in Storybook
                />
              </div>}
            {facet.filterType === 'spatialFilter' &&
              <div className={classes.spinnerContainer}>
                <Typography>
                  Draw a bounding box on the map to filter by {intl.get(`perspectives.${facetClass}.properties.${facetID}.label`)}.
                </Typography>
              </div>}
          </>
        )}
      </>
    )
  }
}

HierarchicalFacet.propTypes = {
  /**
   * Material-UI styles.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Unique id of the facet.
   */
  facetID: PropTypes.string.isRequired,
  /**
   * An object containing the client-side config and values of the facet.
   */
  facet: PropTypes.object.isRequired,
  /**
   * The class of the facet for server-side configs.
   */
  facetClass: PropTypes.string,
  /**
   * A facet should be disabled while some other facet is updating.
   */
  someFacetIsFetching: PropTypes.bool.isRequired,
  /**
   * An integer for detecting if some other facet was updated.
   */
  facetUpdateID: PropTypes.number,
  /**
   * Lastly updated facet filter, from the Redux state.
   */
  updatedFilter: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.array]),
  updatedFacet: PropTypes.string,
  /**
   * Faceted search mode. Storybook mode disables virtualization of react-sortable-tree.
   */
  facetedSearchMode: PropTypes.oneOf(['serverFS', 'clientFS', 'storybook']),
  /**
   * Redux action for fetching the facet values.
   */
  fetchFacet: PropTypes.func,
  /**
   * Redux action for updating the client-side config of the facet.
   */
  updateFacetOption: PropTypes.func,
  /**
   * Redux action for updating the facet in clientFS mode.
   */
  clientFSUpdateFacet: PropTypes.func
}

export const HierarchicalFacetComponent = HierarchicalFacet

export default withStyles(styles)(HierarchicalFacet)
