import {
  FETCH_FACET,
  UPDATE_FACET,
  UPDATE_FILTER,
  OPEN_FACET_DIALOG,
  CLOSE_FACET_DIALOG,
} from '../actions';

export const INITIAL_STATE = {
  facetOptions : {
    creationPlace: {
      id: 'creationPlace',
      label: 'Creation place',
      predicate: '^frbroo:R18_created/crm:P7_took_place_at',
      hierarchical: true,
    },
    author: {
      id: 'author',
      label: 'Author',
      predicate: '^frbroo:R18_created/crm:P14_carried_out_by',
      hierarchical: false
    }
  },
  facetValues : {
    creationPlace: [],
    author: []
  },
  facetFilters: {
    creationPlace: new Set(),
    author: new Set(),
  },
  fetchingFacet : false,
  facetDialogOpen: false,
  activeFacet: ''
};

const facet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OPEN_FACET_DIALOG:
      return {
        ...state,
        facetDialogOpen: true,
        activeFacet: action.property
      };
    case CLOSE_FACET_DIALOG:
      return { ...state, facetDialogOpen: false };
    case FETCH_FACET:
      return { ...state, fetchingFacet: true };
    case UPDATE_FACET:
      return {
        ...state,
        facetValues: action.facetValues,
        fetchingFacet: false
      };
    case UPDATE_FILTER:
      return updateFilter(state, action);
    default:
      return state;
  }
};

const updateFilter = (state, action) => {
  const { property, value } = action.filter;
  let nSet = state.facetFilters[property];
  if (nSet.has(value)) {
    nSet.delete(value);
  } else {
    nSet.add(value);
  }
  const newFilter = updateObject(state.filters, { [property]: nSet });
  return updateObject(state, { facetFilters: newFilter });
};

const updateObject = (oldObject, newValues) => {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  //console.log(Object.assign({}, oldObject, newValues));
  return Object.assign({}, oldObject, newValues);
};

export default facet;
