import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import ChipsArray from './ChipsArray'

const ActiveFilters = props => {
  const {
    uriFilters, textFilters, timespanFilters, dateNoTimespanFilters, integerFilters,
    someFacetIsFetching, fetchingResultCount, propertiesTranslationsID
  } = props
  const facetValues = []
  Object.keys(uriFilters).forEach(activeFacetID => {
    // URI filter may have multiple values
    Object.values(uriFilters[activeFacetID]).forEach(value => {
      facetValues.push({
        facetID: activeFacetID,
        facetLabel: intl.get(`perspectives.${propertiesTranslationsID}.properties.${activeFacetID}.label`),
        filterType: 'uriFilter',
        value: value // a react sortable tree object
      })
    })
  })
  Object.keys(textFilters).forEach(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: intl.get(`perspectives.${propertiesTranslationsID}.properties.${facetID}.label`),
      filterType: 'textFilter',
      value: textFilters[facetID]
    })
  })
  Object.keys(timespanFilters).forEach(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: intl.get(`perspectives.${propertiesTranslationsID}.properties.${facetID}.label`),
      filterType: 'timespanFilter',
      value: timespanFilters[facetID]
    })
  })
  Object.keys(dateNoTimespanFilters).forEach(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: intl.get(`perspectives.${propertiesTranslationsID}.properties.${facetID}.label`),
      filterType: 'dateNoTimespanFilter',
      value: dateNoTimespanFilters[facetID]
    })
  })
  Object.keys(integerFilters).forEach(facetID => {
    facetValues.push({
      facetID: facetID,
      facetLabel: intl.get(`perspectives.${propertiesTranslationsID}.properties.${facetID}.label`),
      filterType: 'integerFilter',
      value: integerFilters[facetID]
    })
  })
  return (
    <ChipsArray
      data={facetValues}
      facetClass={props.facetClass}
      updateFacetOption={props.updateFacetOption}
      someFacetIsFetching={someFacetIsFetching}
      fetchingResultCount={fetchingResultCount}
      fetchFacet={props.fetchFacet}
    />
  )
}

ActiveFilters.propTypes = {
  facetClass: PropTypes.string.isRequired,
  uriFilters: PropTypes.object.isRequired,
  spatialFilters: PropTypes.object.isRequired,
  textFilters: PropTypes.object.isRequired,
  timespanFilters: PropTypes.object.isRequired,
  integerFilters: PropTypes.object.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  someFacetIsFetching: PropTypes.bool.isRequired,
  fetchingResultCount: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func.isRequired
}

export default ActiveFilters
