import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
//import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
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

// https://frontend-collective.github.io/react-sortable-tree/storybook/?selectedKind=Basics&selectedStory=Search&full=0&addons=0&stories=1&panelRight=0

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
    height: '100%'
  },
  treeContainerWithSearchField: {
    height: 'calc(100% - 40px)'
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
  }

});

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
    this.props.fetchFacet(this.props.property);

  }

  componentDidUpdate = prevProps => {
    if (prevProps.data != this.props.data) {
      //console.log(`adding new values for: ${this.props.property}`);
      //console.log(this.props.data)
      this.setState({
        treeData: this.props.data
      });
    }
    // if (this.props.property == 'productionPlace') {
    //   //console.log(this.props.facetFilters[this.props.property])
    //   console.log(this.props.updatedFacet)
    // }
    if (this.props.updatedFacet !== '' && this.props.updatedFacet !== this.props.property && prevProps.facetFilters != this.props.facetFilters) {
      // console.log(`fetching new values for ${this.props.property}`)
      this.props.fetchFacet(this.props.property);
    }
  }

  handleCheckboxChange = treeObj => event => {
    const newTreeData = changeNodeAtPath({
      treeData: this.state.treeData,
      getNodeKey: ({ treeIndex }) =>  treeIndex,
      path: treeObj.path,
      newNode: {
        ...treeObj.node,
        selected: event.target.checked ? 'true' : 'false'
      },
    });
    this.setState({ treeData: newTreeData });
    this.props.updateFilter({
      property: this.props.property,
      value: treeObj.node.id
    });
  };

  handleSearchFieldOnChange = event => {
    this.setState({ searchString: event.target.value });
  }

  generateLabel = node => {
    //let source = node.source == null ? '' : `(source: ${node.source.substring(node.source.lastIndexOf('/') + 1)}`;
    //console.log(node)
    let count = node.totalInstanceCount == null || node.totalInstanceCount == 0 ? node.instanceCount : node.totalInstanceCount;
    return `${node.prefLabel} (${count})`;
  }

  generateLabelClass = (classes, node) => {
    let labelClass = classes.label;
    if (this.props.property === 'author' || this.props.property === 'productionPlace' || this.props.property === 'source') {
      if (node.source === 'http://ldf.fi/mmm/schema/SDBM' || node.id === 'http://ldf.fi/mmm/schema/SDBM') {
        labelClass = classes.sdbmLabel;
      }
      if (node.source === 'http://ldf.fi/mmm/schema/Bodley' || node.id === 'http://ldf.fi/mmm/schema/Bodley') {
        labelClass = classes.bodleyLabel;
      }
      if (node.source === 'http://ldf.fi/mmm/schema/Bibale' || node.id === 'http://ldf.fi/mmm/schema/Bibale') {
        labelClass = classes.bibaleLabel;
      }
    }
    return labelClass;
  }

  render() {
    const { classes } = this.props;
    const { searchString, searchFocusIndex, searchFoundCount } = this.state;
    //console.log(this.props.data)

    // Case insensitive search of `node.title`
    const customSearchMethod = ({ node, searchQuery }) =>
      searchQuery.length > 2  &&
      node.prefLabel.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

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
        {this.props.fetchingFacet ?
          <div className={classes.spinnerContainer}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>
          :
          <React.Fragment>
            {this.props.searchField &&
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
            <div className={this.props.searchField ? classes.treeContainerWithSearchField : classes.treeContainer }>
              <SortableTree
                treeData={this.state.treeData}
                onChange={treeData => this.setState({ treeData })}
                canDrag={false}
                rowHeight={30}
                // Custom comparison for matching during search.
                // This is optional, and defaults to a case sensitive search of
                // the title and subtitle values.
                // see `defaultSearchMethod` in https://github.com/frontend-collective/react-sortable-tree/blob/master/src/utils/default-handlers.js
                searchMethod={customSearchMethod}
                searchQuery={searchString}
                // When matches are found, this property lets you highlight a specific
                // match and scroll to it. This is optional.
                searchFocusOffset={searchFocusIndex}
                // This callback returns the matches from the search,
                // including their `node`s, `treeIndex`es, and `path`s
                // Here I just use it to note how many matches were found.
                // This is optional, but without it, the only thing searches
                // do natively is outline the matching nodes.
                searchFinishCallback={matches =>
                  this.setState({
                    searchFoundCount: matches.length,
                    searchFocusIndex:
                        matches.length > 0 ? searchFocusIndex % matches.length : 0,
                  })
                }
                onlyExpandSearchedNodes={true}
                theme={FileExplorerTheme}
                generateNodeProps={n => ({
                  title: (
                    <FormControlLabel
                      control={
                        <Checkbox
                          className={classes.checkbox}
                          checked={n.node.selected == 'true' ? true : false}
                          disabled={n.node.instanceCount > 0 ? false : true}
                          onChange={this.handleCheckboxChange(n)}
                          value={n.node.id}
                          color="primary"
                        />
                      }
                      label={this.generateLabel(n.node)}
                      classes={{
                        label: this.generateLabelClass(classes, n.node)
                      }}
                    />
                  ),
                })}
              />
            </div>
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

HierarchicalFacet.propTypes = {
  classes: PropTypes.object.isRequired,
  property: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchingFacet: PropTypes.bool.isRequired,
  facetFilters: PropTypes.object.isRequired,
  updateFilter: PropTypes.func.isRequired,
  updatedFacet: PropTypes.string.isRequired,
  searchField: PropTypes.bool.isRequired,
};

export default withStyles(styles)(HierarchicalFacet);
