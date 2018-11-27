import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = () => ({
  root: {
    height: '100%',
  },
  searchForm: {
    display: 'inline-block',
    height: 50,
  },
  treeContainer: {
    height: 'calc(100% - 50px)',
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

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: this.props.data,
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
    };
  }

  handleCheckboxChange = treeObj => event => {
    const newTreeData = changeNodeAtPath({
      treeData: this.state.treeData,
      getNodeKey: ({ treeIndex }) =>  treeIndex,
      path: treeObj.path,
      newNode: {
        ...treeObj.node,
        selected: event.target.checked
      },
    });
    this.setState({ treeData: newTreeData });
    this.props.updateFilter({
      property: 'creationPlace',
      value: treeObj.node.id
    });
  };

  render() {
    const { classes } = this.props;
    const { searchString, searchFocusIndex, searchFoundCount } = this.state;

    // Case insensitive search of `node.title`
    const customSearchMethod = ({ node, searchQuery }) =>
      searchQuery &&
      node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

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
      <div className={classes.root}>
        <form
          className={classes.searchForm}
          onSubmit={event => {
            event.preventDefault();
          }}
        >
          <input
            id="find-box"
            type="text"
            placeholder="Search..."
            style={{ fontSize: '1rem' }}
            value={searchString}
            onChange={event =>
              this.setState({ searchString: event.target.value })
            }
          />

          <button
            type="button"
            disabled={!searchFoundCount}
            onClick={selectPrevMatch}
          >
            &lt;
          </button>

          <button
            type="submit"
            disabled={!searchFoundCount}
            onClick={selectNextMatch}
          >
            &gt;
          </button>

          <span>
            &nbsp;
            {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
            &nbsp;/&nbsp;
            {searchFoundCount || 0}
          </span>
        </form>
        <div className={classes.treeContainer}>
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
                      checked={n.node.selected}
                      onChange={this.handleCheckboxChange(n)}
                      value={n.node.id}
                      color="primary"
                    />
                  }
                  label={`${n.node.title} (${n.node.totalCnt == 0 ? n.node.cnt : n.node.totalCnt})`}
                  classes={{
                    root: classes.formControlRoot
                  }}
                />
              ),
            })}
          />
        </div>
      </div>
    );
  }
}

Tree.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(Tree);
