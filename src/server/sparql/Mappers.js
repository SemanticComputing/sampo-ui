import _ from 'lodash';
import { getTreeFromFlatData } from 'react-sortable-tree';

//https://github.com/SemanticComputing/angular-paging-sparql-service/blob/master/src/sparql.object-mapper-service.js

export const groupBy = (sparqlBindings, group) => Object.values(_.reduce(sparqlBindings, (results, sparqlResult) => {
  const id = _.get(sparqlResult[group], 'value');
  if (id === undefined) {
    return [];
  }
  if (!results[id]) {
    results[id] = {};
  }
  let result = results[id];
  _.forOwn(sparqlResult, (value, key) => {
    if (key === group) {
      result[group] = value.value; // ignore lang tags
    } else {
      const oldValues = result[key];
      // add new value if it doesn't already exist
      if (!_.includes(oldValues, value.value)) {
        (result[key] || (result[key] = [])).push(value.value);
      }
    }
  });
  return results;
}, {}));

// export const mergeSuggestions = (suggestions) => {
//   return groupBy(_.compact(_.flatten(suggestions)), 'label', false);
// };
//
//
// export const mergeSimpleSuggestions = (suggestions) => {
//
//   // Suggestions from different datasets may have duplicates
//   let uniqueSuggestions = [...new Set(_.flatten(suggestions))];
//
//   // Sort suggestions alphabetically, because Lunece score does
//   // not work with wildcard queries.
//   return uniqueSuggestions.sort();
// };
//

// const capitalizeFirstLetter = (string) => {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// };

export const mapManuscripts = (sparqlBindings) => {
  // console.log(sparqlBindings);
  const results = sparqlBindings.map(b => {
    return {
      id: b.id.value,
      prefLabel: createStringList(b.prefLabel.value),
      //entry: createStringList(b.entry.value),
      manuscriptRecord: _.has(b, 'manuscriptRecord') ? createStringList(b.manuscriptRecord.value) : '-',
      author: _.has(b, 'author',) ? createObjectList(b.author.value, 'names') : '-',
      owner: _.has(b, 'owner',) ? createObjectList(b.owner.value, 'names') : '-',
      timespan: _.has(b, 'timespan',) ? createStringList(b.timespan.value) : '-',
      creationPlace: _.has(b, 'creationPlace',) ? createObjectList(b.creationPlace.value, 'places') : '-',
      material: _.has(b, 'material',) ? createStringList(b.material.value) : '-',
      language: _.has(b, 'language',) ? createStringList(b.language.value) : '-',
    };
  });
  return results;
};

const createStringList = (str) => {
  const list = str.split('|');
  return list.length < 2 ? list[0] : list;
};

const createObjectList = (str, sdbmType) => {
  const list = str.split('|');
  if (list.length < 2) {
    return createObject(list[0], sdbmType);
  } else {
    return list.map(item => {
      return createObject(item, sdbmType);
    });
  }
};

const createObject = (str, sdbmType) => {
  const values = str.split(';');
  if (values.length > 2) {
    return {
      id: values[1],
      prefLabel: values[0],
      order: values[2],
      entry: values[3],
      sdbmLink: `https://sdbm.library.upenn.edu/${sdbmType}/${values[1].substring(values[1].lastIndexOf('/') + 1)}`
    };
  } else {
    return {
      id: values[1],
      prefLabel: values[0],
      sdbmLink: `https://sdbm.library.upenn.edu/${sdbmType}/${values[1].substring(values[1].lastIndexOf('/') + 1)}`
    };
  }
};

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

export const mapAllResults = (results) => groupBy(results, 'id');

export const mergeFederatedResults = (results) => {
  // SPARQL query defines the ordering of results of one dataset.
  // Return all merged results subsequentially.
  //console.log(_.flatten(results))
  return _.flatten(results);
};
