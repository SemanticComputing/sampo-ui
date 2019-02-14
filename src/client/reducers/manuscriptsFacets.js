import {
  FETCH_FACET,
  UPDATE_FACET,
  UPDATE_FILTER,
  OPEN_FACET_DIALOG,
  CLOSE_FACET_DIALOG,
} from '../actions';
import { updateFilter } from './helpers';

export const INITIAL_STATE = {
  facets: {
    source: {
      id: 'source',
      label: 'Source',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      isFetching: false,
    },
    productionPlace: {
      id: 'productionPlace',
      label: 'Production place',
      //predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      isFetching: false,
    },
    author: {
      id: 'author',
      label: 'Author',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      isFetching: false,
    },
    // language: {
    //   id: 'language',
    //   label: 'Language',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'asc',
    //   isFetching: false,
    // },
  },
  filters: {
    productionPlace: new Set(),
    author: new Set(),
    source: new Set(),
    language: new Set(),
  },
  updatedFacet: ''
};

const manuscriptsFacets = (state = INITIAL_STATE, action) => {
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
        facets: {
          ...state.facets,
          [ action.id ]: {
            ...state.facets[action.id],
            distinctValueCount: 0,
            values: [],
            sortBy: action.sortBy,
            sortDirection: action.sortDirection,
            isFetching: true
          }
        }
      };
    case UPDATE_FACET:
      return {
        ...state,
        facets: {
          ...state.facets,
          [ action.id ]: {
            ...state.facets[action.id],
            distinctValueCount: action.distinctValueCount,
            values: action.values,
            sortBy: action.sortBy,
            sortDirection: action.sortDirection,
            isFetching: false
          }
        }
      };
    case UPDATE_FILTER:
      return updateFilter(state, action);
    default:
      return state;
  }
};

export default manuscriptsFacets;
