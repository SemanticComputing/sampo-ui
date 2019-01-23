import {
  FETCH_FACET,
  UPDATE_FACET,
  UPDATE_FILTER,
  OPEN_FACET_DIALOG,
  CLOSE_FACET_DIALOG,
} from '../actions';

export const INITIAL_STATE = {
  productionPlace: {
    distinctValueCount: 0,
    values: [],
    sortBy: 'prefLabel',
    sortDirection: 'asc',
    isFetching: false,
  },
  author: {
    distinctValueCount: 0,
    values: [],
    sortBy: 'prefLabel',
    sortDirection: 'asc',
    isFetching: false,
  },
  source: {
    distinctValueCount: 0,
    values: [],
    sortBy: 'instanceCount',
    sortDirection: 'desc',
    isFetching: false,
  },
  language: {
    distinctValueCount: 0,
    values: [],
    sortBy: 'instanceCount',
    sortDirection: 'asc',
    isFetching: false,
  },
  facetFilters: {
    productionPlace: new Set(),
    author: new Set(),
    source: new Set(),
    language: new Set(),
  },
  facetOptions : {
    productionPlace: {
      id: 'productionPlace',
      label: 'Production place',
      //predicate: defined in backend
    },
    author: {
      id: 'author',
      label: 'Author',
      // predicate: defined in backend
    },
    source: {
      id: 'source',
      label: 'Source',
      // predicate: defined in backend
    },
    language: {
      id: 'language',
      label: 'Language',
      // predicate: defined in backend
    }
  },
  updatedFacet: ''
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
      return {
        ...state,
        [ action.id ]: {
          distinctValueCount: 0,
          values: [],
          sortBy: action.sortBy,
          sortDirection: action.sortDirection,
          isFetching: true
        }
      };
    case UPDATE_FACET:
      return {
        ...state,
        [ action.id ]: {
          distinctValueCount: action.distinctValueCount,
          values: action.values,
          sortBy: action.sortBy,
          sortDirection: action.sortDirection,
          isFetching: false
        }
      };
    case UPDATE_FILTER:
      return updateFilter(state, action);
    default:
      return state;
  }
};

const updateFilter = (state, action) => {
  const { property, value } = action.filter;
  let valueSet = state.facetFilters[property];
  if (valueSet.has(value)) {
    valueSet.delete(value);
  } else {
    valueSet.add(value);
  }
  const newFacetFilters = {
    ...state.facetFilters,
    [ property ] : valueSet
  };
  return {
    ...state,
    facetFilters: newFacetFilters,
    updatedFacet: property
  };
};

export default facet;
