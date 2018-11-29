import _ from 'lodash';
import { getTreeFromFlatData } from 'react-sortable-tree';

export const mapPlaces = (sparqlBindings) => {
  //console.log(sparqlBindings);
  const results = sparqlBindings.map(b => {
    return {
      id: b.id.value,
      label: b.label.value,
      lat: _.has(b, 'lat',) ? b.lat.value : 'Undefined',
      long: _.has(b, 'long',) ? b.long.value : 'Undefined',
      source: _.has(b, 'source',) ? b.source.value : 'Undefined',
      manuscript: _.has(b, 'manuscript',) ? b.manuscript.value.split(',') : 'Undefined',
      manuscriptCount: _.has(b, 'manuscriptCount',) ? b.manuscriptCount.value : 'Undefined',
    };
  });
  return results;
};

export const mapCount = (sparqlBindings) => {
  return {
    count: sparqlBindings[0].count.value
  };
};

export const mapFacet = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    return {
      title: b.facet_text.value,
      id: _.has(b, 'value',) ? b.value.value : 'no_selection',
      cnt: b.cnt.value,
      selected: false
    };
  });
  return results;
};

export const mapHierarchicalFacet = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    return {
      title: b.facet_text.value,
      id: _.has(b, 'value',) ? b.value.value : 'no_selection',
      cnt: b.cnt.value,
      parent: _.has(b, 'parent',) ? b.parent.value : '0',
      selected: false
    };
  });
  let treeData = getTreeFromFlatData({
    flatData: results,
    getKey: node => node.id, // resolve a node's key
    getParentKey: node => node.parent, // resolve node's parent's key
    rootKey: 0, // The value of the parent key when there is no parent (i.e., at root level)
  });
  treeData = recursiveSort(treeData);
  treeData.forEach(node => sumUp(node));
  return treeData;
};

const comparator = (a, b) => a.title.localeCompare(b.title);

const sumUp = node => {
  node.totalCnt = parseInt(node.cnt);
  if (_.has(node, 'children')) {
    for (let child of node.children) {
      node.totalCnt += sumUp(child);
    }
  }
  return node.totalCnt;
};

const recursiveSort = nodes => {
  nodes.sort(comparator);
  nodes.forEach(node => {
    if (_.has(node, 'children')) {
      recursiveSort(node.children);
    }
  });
  return nodes;
};
