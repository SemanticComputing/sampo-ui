import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { has } from 'lodash';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Typography from '@material-ui/core/Typography';

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
    flex: 1,
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
    marginRight: 4,
  },
  label: {
    // no styling
  },
  sdbmLabel: {
    color: '#00796B'
  },
  bodleyLabel: {
    color: '#F50057'
  },
  bibaleLabel: {
    color: '#F57F17'
  },
  facetLink: {
    textDecoration: 'inherit'
  }

});

/*
This component is based on the React Sortable Tree example at:
https://frontend-collective.github.io/react-sortable-tree/storybook/?selectedKind=Basics&selectedStory=Search&full=0&addons=0&stories=1&panelRight=0
*/
class HierarchicalFacet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
    };
  }

  componentDidMount = () => {
    // console.log(`${this.props.facetID} mounted`);
    if (this.props.facet.filterType === 'uriFilter') {
      this.props.fetchFacet({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
      });
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {

      // update component state if the user modified this facet
      if (this.props.updatedFacet === this.props.facetID) {
        if (has(this.props.updatedFilter, 'path')) {
          const treeObj = this.props.updatedFilter;
          let newTreeData = changeNodeAtPath({
            treeData: this.state.treeData,
            getNodeKey: ({ treeIndex }) =>  treeIndex,
            path: treeObj.path,
            newNode: () => {
              const oldNode = treeObj.node;
              if (has(oldNode, 'children')) {
                return {
                  ...oldNode,
                  selected: treeObj.added ? 'true' : 'false',
                  children: this.recursiveSelect(oldNode.children, treeObj.added)
                };
              } else {
                return {
                  ...oldNode,
                  selected: treeObj.added ? 'true' : 'false',
                };
              }
            }
          });
          this.setState({ treeData: newTreeData });
        }
      }
      // else fetch new values, because some other facet was updated
      else {
        this.props.fetchFacet({
          facetClass: this.props.facetClass,
          facetID: this.props.facetID,
        });
      }
    }

    // fetch new values if the user changes the filter type or sort order
    if (prevProps.facet.filterType !== this.props.facet.filterType
      && this.props.facet.filterType === 'uriFilter') {
      this.props.fetchFacet({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
      });
    }
    if (prevProps.facet.sortBy !== this.props.facet.sortBy) {
      this.props.fetchFacet({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
      });
    }

    // when values have been fetched, update component's state
    if (prevProps.facet.values != this.props.facet.values) {
      this.setState({
        treeData: this.props.facet.values
      });
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
        });
      }
      node.selected = selected ? 'true' : 'false';
      node.disabled = selected ? 'true' : 'false';
      if (has(node, 'children')) {
        this.recursiveSelect(node.children, selected);
      }
    });
    return nodes;
  };

  handleCheckboxChange = treeObj => () => {
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: this.props.facet.filterType,
      value: treeObj
    });
  };

  handleSearchFieldOnChange = event => {
    this.setState({ searchString: event.target.value });
  }

  generateNodeProps = treeObj => {
    const { uriFilter} = this.props.facet;
    const { node } = treeObj;
    let selectedCount = uriFilter == null ? 0 : Object.keys(this.props.facet.uriFilter).length;
    let isSelected = node.selected === 'true' ? true : false;
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
                (this.props.facet.type !== 'hierarchical'
                && node.instanceCount == 0
                && node.selected === 'false')
                // prevent selecting unknown value:
                || node.id == 'http://ldf.fi/MISSING_VALUE'
                // prevent selecting when another facet is still updating:
                || this.props.someFacetIsFetching
                // prevent selecting all facet values:
                || (selectedCount >= this.props.facet.distinctValueCount - 1 && !isSelected)
                // prevent selecting when parent has been selected
                || node.disabled === 'true'
              }
              onChange={this.handleCheckboxChange(treeObj)}
              value={treeObj.node.id}
              color="primary"
            />
          }
          label={this.generateLabel(treeObj.node)}
          classes={{
            label: this.generateLabelClass(this.props.classes, treeObj.node)
          }}
        />
      )
    };
  };

  generateLabel = node => {
    let count = node.totalInstanceCount == null || node.totalInstanceCount == 0 ? node.instanceCount : node.totalInstanceCount;
    let missingValue = node.id === 'http://ldf.fi/MISSING_VALUE';
    return (
      <React.Fragment>
        <Typography variant='body2'>
          {!missingValue &&
            <a
              className={this.props.classes.facetLink}
              target='_blank' rel='noopener noreferrer'
              href={node.id}
            >
              {node.prefLabel}
            </a>
          }
          {missingValue && node.prefLabel}
          <span> [{count}]</span>
        </Typography>
      </React.Fragment>
    );
  }

  generateLabelClass = classes => {
    let labelClass = classes.label;
    // if (this.props.facetID === 'author' || this.props.facetID === 'source') {
    //   if (node.source === 'http://ldf.fi/mmm/schema/SDBM' || node.id === 'http://ldf.fi/mmm/schema/SDBM') {
    //     labelClass = classes.sdbmLabel;
    //   }
    //   if (node.source === 'http://ldf.fi/mmm/schema/Bodley' || node.id === 'http://ldf.fi/mmm/schema/Bodley') {
    //     labelClass = classes.bodleyLabel;
    //   }
    //   if (node.source === 'http://ldf.fi/mmm/schema/Bibale' || node.id === 'http://ldf.fi/mmm/schema/Bibale') {
    //     labelClass = classes.bibaleLabel;
    //   }
    // }
    return labelClass;
  }

  render() {
    const { searchString, searchFocusIndex, searchFoundCount } = this.state;
    const { classes, facet } = this.props;
    const { isFetching, searchField } = facet;
    // if (this.props.facetID == 'owner') {
    //   console.log(this.state.treeData)
    // }

    // Case insensitive search of `node.title`
    const customSearchMethod = ({ node, searchQuery }) => {
      let prefLabel = Array.isArray(node.prefLabel) ? node.prefLabel[0] : node.prefLabel;
      return searchQuery.length > 2  &&
      prefLabel.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
    };

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    return (
      <React.Fragment>
        {isFetching ?
          <div className={classes.spinnerContainer}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>
          :
          <React.Fragment>

            {searchField && facet.filterType !== 'spatialFilter' &&
              <div className={classes.facetSearchContainer}>
                <Input
                  placeholder={`Search...`}
                  onChange={this.handleSearchFieldOnChange}
                >
                </Input>
                {searchFoundCount > 0 &&
                  <React.Fragment>
                    <IconButton
                      className={classes.facetSearchIconButton}
                      aria-label="Previous"
                      onClick={selectPrevMatch}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton
                      className={classes.facetSearchIconButton}
                      aria-label="Next"
                      onClick={selectNextMatch}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                    <Typography>
                      {searchFoundCount > 0 ? searchFocusIndex + 1 : 0} / {searchFoundCount || 0}
                    </Typography>
                  </React.Fragment>
                }
              </div>
            }
            {facet.filterType !== 'spatialFilter' &&
              <div className={searchField ? classes.treeContainerWithSearchField : classes.treeContainer }>
                <SortableTree
                  treeData={this.state.treeData}
                  onChange={treeData => this.setState({ treeData })}
                  canDrag={false}
                  rowHeight={30}
                  searchMethod={customSearchMethod}
                  searchQuery={searchString}
                  searchFocusOffset={searchFocusIndex}
                  searchFinishCallback={matches =>
                    this.setState({
                      searchFoundCount: matches.length,
                      searchFocusIndex:
                          matches.length > 0 ? searchFocusIndex % matches.length : 0,
                    })
                  }
                  onlyExpandSearchedNodes={true}
                  theme={FileExplorerTheme}
                  generateNodeProps={this.generateNodeProps}
                />
              </div>}
            {facet.filterType === 'spatialFilter' &&
              <div className={classes.spinnerContainer}>
                <Typography>
                  Draw a bounding box on the map to filter by {this.props.facet.label.toLowerCase()}.
                </Typography>
              </div>
            }
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

HierarchicalFacet.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.object.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func,
  facetUpdateID: PropTypes.number,
  updatedFilter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  updatedFacet: PropTypes.string,
};

export default withStyles(styles)(HierarchicalFacet);
