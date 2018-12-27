import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

const styles = () => ({
  searchForm: {
    display: 'inline-block',
    height: 50,
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  treeNode: {
    fontFamily: 'Roboto',
  },
  formControlRoot: {
    //maxHeight: 24
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 3,
    marginLeft: 10
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
      console.log(`fetching new values for ${this.props.property}`)
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

  generateLabel = node => {
    //let source = node.source == null ? '' : `(source: ${node.source.substring(node.source.lastIndexOf('/') + 1)}`;
    //console.log(node)
    let count = node.totalInstanceCount == null || node.totalInstanceCount == 0 ? node.instanceCount : node.totalInstanceCount;
    return `${node.prefLabel} (${count})`;
  }

  render() {
    const { classes } = this.props;
    const { searchString, searchFocusIndex, /*searchFoundCount*/ } = this.state;

    // Case insensitive search of `node.title`
    const customSearchMethod = ({ node, searchQuery }) =>
      searchQuery &&
      node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

    // const selectPrevMatch = () =>
    //   this.setState({
    //     searchFocusIndex:
    //       searchFocusIndex !== null
    //         ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
    //         : searchFoundCount - 1,
    //   });
    //
    // const selectNextMatch = () =>
    //   this.setState({
    //     searchFocusIndex:
    //       searchFocusIndex !== null
    //         ? (searchFocusIndex + 1) % searchFoundCount
    //         : 0,
    //   });

      // <form
      //   className={classes.searchForm}
      //   onSubmit={event => {
      //     event.preventDefault();
      //   }}
      // >
      //   <input
      //     id="find-box"
      //     type="text"
      //     placeholder="Search..."
      //     style={{ fontSize: '1rem' }}
      //     value={searchString}
      //     onChange={event =>
      //       this.setState({ searchString: event.target.value })
      //     }
      //   />
      //
      //   <button
      //     type="button"
      //     disabled={!searchFoundCount}
      //     onClick={selectPrevMatch}
      //   >
      //     &lt;
      //   </button>
      //
      //   <button
      //     type="submit"
      //     disabled={!searchFoundCount}
      //     onClick={selectNextMatch}
      //   >
      //     &gt;
      //   </button>
      //
      //   <span>
      //     &nbsp;
      //     {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
      //     &nbsp;/&nbsp;
      //     {searchFoundCount || 0}
      //   </span>
      // </form>

      //

    return (
      <React.Fragment>
        {this.props.fetchingFacet ?
          <div className={classes.spinnerContainer}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>
          :
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
                    root: classes.formControlRoot
                  }}
                />
              ),
            })}
          />
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
};

export default withStyles(styles)(HierarchicalFacet);
