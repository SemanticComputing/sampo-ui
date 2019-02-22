export const updateSortBy = (state, action) => {
  if (state.sortBy === action.sortBy) {
    return {
      ...state,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
    };
  } else {
    return {
      ...state,
      sortBy: action.sortBy,
      sortDirection: 'asc'
    };
  }
};

export const updateFilter = (state, action) => {
  const { property, value } = action;
  let valueSet = state.filters[property];
  if (valueSet.has(value)) {
    valueSet.delete(value);
  } else {
    valueSet.add(value);
  }
  const newFacetFilters = {
    ...state.filters,
    [ property ] : valueSet
  };
  return {
    ...state,
    filters: newFacetFilters,
    updatedFacet: property
  };
};
