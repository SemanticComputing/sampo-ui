import 'rc-tree/assets/index.css';
import React from 'react';
import Tree from 'rc-tree';
import cssAnimation from 'css-animation';
import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';

const animate = (node, show, done) => {
  let height = node.offsetHeight;
  return cssAnimation(node, 'tree-node-collapse', {
    start() {
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
      } else {
        height = node.offsetHeight;
        node.style.height = 0;
      }
    },
    active() {
      node.style.height = `${show ? height : 0}px`;
    },
    end() {
      node.style.height = '';
      done();
    },
  });
};

const animation = {
  enter(node, done) {
    return animate(node, true, done);
  },
  leave(node, done) {
    return animate(node, false, done);
  },
};

const ReactTree = (props) => {
  return (
    <Tree
      defaultExpandAll={false}
      defaultExpandedKeys={['p1']}
      openAnimation={animation}
      treeData={props.data}
    />
  );
};

ReactTree.propTypes = {
  //classes: PropTypes.object.isRequired,
  data: PropTypes.array
};

export default ReactTree;
