import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SortableTree, { getTreeFromFlatData } from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';

const styles = () => ({
  root: {
    width: 500,
    height: 500
  },
  treeNode: {
    fontFamily: 'Roboto',
  }
});

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: getTreeFromFlatData({
        flatData: this.props.data,
        getKey: node => node.id, // resolve a node's key
        getParentKey: node => node.parent, // resolve node's parent's key
        rootKey: 0, // The value of the parent key when there is no parent (i.e., at root level)
      }),
    };

  }

  render() {
    const { classes } = this.props;
    //console.log(this.state.treeData)
    return (
      <div className={classes.root}>
        <SortableTree
          treeData={this.state.treeData}
          getNodeKey={({ node }) => node.id}
          onChange={treeData => this.setState({ treeData })}
          theme={FileExplorerTheme}
          generateNodeProps={({ node }) => ({
            title: (
              <a
                className={classes.treeNode}
                target='_blank' rel='noopener noreferrer'
                href={node.id.replace('http://ldf.fi/mmm/place/', 'https://sdbm.library.upenn.edu/places/')}
              >
                {node.title}
              </a>
            ),
          })}
        />
      </div>
    );
  }
}

Tree.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default withStyles(styles)(Tree);
