import {
  FETCH_FACET,
  UPDATE_FACET,
  UPDATE_FILTER,
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
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'five',
    },
  },
  filters: {
    source: new Set(),
    place: new Set(),
  },
  updatedFacet: '',
  fetching: false
};

const organizationsFacets = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'organizations') {
    switch (action.type) {
      case FETCH_FACET:
        return {
          ...state,
          fetching: true,
          facets: {
            ...state.facets,
            [ action.id ]: {
              ...state.facets[action.id],
              distinctValueCount: 0,
              values: [],
              flatValues: [],
              sortBy: action.sortBy,
              sortDirection: action.sortDirection,
              isFetching: true
            }
          }
        };
      case UPDATE_FACET:
        return {
          ...state,
          fetching: false,
          facets: {
            ...state.facets,
            [ action.id ]: {
              ...state.facets[action.id],
              distinctValueCount: action.distinctValueCount,
              values: action.values,
              flatValues: action.flatValues || [],
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
  } else return state;
};

export default organizationsFacets;
