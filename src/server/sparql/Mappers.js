import _ from 'lodash';

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
  //console.log(sparqlBindings);
  const results = sparqlBindings.map(b => {
    return {
      id: b.id.value,
      manuscriptRecord: _.has(b, 'manuscriptRecord') ? b.manuscriptRecord.value : '-',
      prefLabel: b.prefLabel.value.split('|'),
      author: _.has(b, 'author',) ? createObjectList(b.author.value, 'names') : '-',
      timespan: _.has(b, 'timespan',) ? b.timespan.value.split('|') : '-',
      creationPlace: _.has(b, 'creationPlace',) ? createObjectList(b.creationPlace.value, 'places') : '-',
      material: _.has(b, 'material',) ? b.material.value.split('|') : '-',
      language: _.has(b, 'language',) ? b.language.value.split('|') : '-',
    };
  });
  return results;
};

const createObjectList = (str, sdbmType) => {
  const strings = str.split('|');
  return strings.map(s => {
    const values = s.split(';');
    return {
      id: values[1].substring(values[1].lastIndexOf('/') + 1),
      //id: values[0],
      prefLabel: values[0],
      sdbmType: sdbmType
    };
  });
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

export const mapFacet = (sparqlBindings) => {
  const results = sparqlBindings.map(b => {
    return {
      key: b.value.value,
      title: b.facet_text.value,
      cnt: b.cnt.value,
      parent: _.has(b, 'parent',) ? b.parent.value : '0',
    };
  });
  const treeData = getTreeFromFlatData({
    flatData: results,
    getKey: node => node.key, // resolve a node's key
    getParentKey: node => node.parent, // resolve node's parent's key
    rootKey: 0, // The value of the parent key when there is no parent (i.e., at root level)
  });
  return treeData;
};

/**
 * Generate a tree structure from flat data.
 *
 * @param {!Object[]} flatData
 * @param {!function=} getKey - Function to get the key from the nodeData
 * @param {!function=} getParentKey - Function to get the parent key from the nodeData
 * @param {string|number=} rootKey - The value returned by `getParentKey` that corresponds to the root node.
 *                                  For example, if your nodes have id 1-99, you might use rootKey = 0
 *
 * @return {Object[]} treeData - The flat data represented as a tree
 */
const getTreeFromFlatData = ({
  flatData,
  getKey = node => node.id,
  getParentKey = node => node.parentId,
  rootKey = '0',
}) => {
  if (!flatData) {
    return [];
  }

  const childrenToParents = {};
  flatData.forEach(child => {
    const parentKey = getParentKey(child);

    if (parentKey in childrenToParents) {
      childrenToParents[parentKey].push(child);
    } else {
      childrenToParents[parentKey] = [child];
    }
  });

  if (!(rootKey in childrenToParents)) {
    return [];
  }

  const trav = parent => {
    const parentKey = getKey(parent);
    if (parentKey in childrenToParents) {
      return {
        ... parent,
        children: childrenToParents[parentKey].map(child => trav(child)),
      };
    }
    return { ...parent };
  };

  const comparator = (a, b) => a.title.localeCompare(b.title);

  const recursiveSort = nodes => {
    nodes.sort(comparator);
    nodes.forEach(node => {
      if (_.has(node, 'children')) {
        recursiveSort(node.children);
      }
    });
    return nodes;
  };

  const unsortedTreeData = childrenToParents[rootKey].map(child => trav(child));

  return recursiveSort(unsortedTreeData);
};





export const mapAllResults = (results) => groupBy(results, 'id');

export const mergeFederatedResults = (results) => {
  // SPARQL query defines the ordering of results of one dataset.
  // Return all merged results subsequentially.
  //console.log(_.flatten(results))
  return _.flatten(results);
};
