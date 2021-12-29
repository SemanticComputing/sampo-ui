import React from 'react'
import querystring from 'querystring'
import { has, sortBy } from 'lodash'
import intl from 'react-intl-universal'
import MuiIcon from '../components/main_layout/MuiIcon'

export const stateToUrl = ({
  perspectiveID = null,
  facets,
  facetClass = null,
  page = null,
  pagesize = null,
  sortBy = null,
  sortDirection = null,
  resultFormat = null,
  constrainSelf = null,
  groupBy = null,
  uri = null,
  limit = null,
  optimize = null,
  fromID = null,
  toID = null,
  period = null,
  province = null
}) => {
  const params = {}
  if (perspectiveID !== null) { params.perspectiveID = perspectiveID }
  if (facetClass !== null) { params.facetClass = facetClass }
  if (page !== null) { params.page = page }
  if (pagesize !== null) { params.pagesize = parseInt(pagesize) }
  if (sortBy !== null) { params.sortBy = sortBy }
  if (sortDirection !== null) { params.sortDirection = sortDirection }
  if (resultFormat !== null) { params.resultFormat = resultFormat }
  if (constrainSelf !== null) { params.constrainSelf = constrainSelf }
  if (groupBy !== null) { params.groupBy = groupBy }
  if (uri !== null) { params.uri = uri }
  if (limit !== null) { params.limit = limit }
  if (optimize !== null) { params.optimize = optimize }
  if (fromID !== null) { params.fromID = fromID }
  if (toID !== null) { params.toID = toID }
  if (period !== null) { params.period = period }
  if (province !== null) { params.province = province }
  if (facets !== null) {
    const constraints = []
    for (const [key, value] of Object.entries(facets)) {
      if (has(value, 'uriFilter') && value.uriFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: Object.keys(value.uriFilter),
          ...(Object.prototype.hasOwnProperty.call(value, 'selectAlsoSubconcepts') &&
            { selectAlsoSubconcepts: value.selectAlsoSubconcepts }),
          useConjuction: Object.prototype.hasOwnProperty.call(value, 'useConjuction')
            ? value.useConjuction
            : false
        })
      } else if (has(value, 'spatialFilter') && value.spatialFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: boundsToValues(value.spatialFilter._bounds)
        })
      } else if (has(value, 'textFilter') && value.textFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: value.textFilter
        })
      } else if (has(value, 'timespanFilter') && value.timespanFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: value.timespanFilter
        })
      } else if (has(value, 'integerFilter') && value.integerFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: value.integerFilter
        })
      }
    }
    if (constraints.length > 0) {
      params.constraints = constraints
    }
  }
  return params
}

export const urlToState = ({ initialState, queryString }) => {
  const params = querystring.parse(queryString)
  return params
}

export const boundsToValues = bounds => {
  const latMin = bounds._southWest.lat
  const longMin = bounds._southWest.lng
  const latMax = bounds._northEast.lat
  const longMax = bounds._northEast.lng
  return {
    latMin: latMin,
    longMin: longMin,
    latMax: latMax,
    longMax: longMax
  }
}

export const handleAxiosError = error => {
  if (error.response) {
  // The request was made and the server responded with a status code
  // that falls out of the range of 2xx
    console.log(error.response.data)
  // console.log(error.response.status);
  // console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request)
  } else {
  // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message)
  }
  console.log(error.config)
}

export const pickSelectedDatasets = datasets => {
  const selected = []
  Object.keys(datasets).forEach(key => {
    if (datasets[key].selected) {
      selected.push(key)
    }
  })
  return selected
}

export const updateLocaleToPathname = ({ pathname, locale, replaceOld }) => {
  const numberOfSlashes = pathname.split('/').length - 1
  let newPathname
  if (replaceOld) {
    const pathnameLangRemoved = numberOfSlashes === 1 ? '' : pathname.substring(pathname.indexOf('/', 1))
    newPathname = `/${locale}${pathnameLangRemoved}` // TODO: handle rootUrl from generalConfig
  } else {
    newPathname = `/${locale}${pathname}`
  }
  return newPathname
}

export const objectToQueryParams = data => {
  return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&')
}

export const arrayToObject = ({ array, keyField }) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {})

export const generateLabelForMissingValue = ({ facetClass, facetID }) => {
  // Check if there is a translated label for missing value, or use defaults
  return intl.get(`perspectives.${facetClass}.properties.${facetID}.missingValueLabel`) ||
   intl.get('facetBar.defaultMissingValueLabel') || 'Unknown'
}

export const getLocalIDFromAppLocation = ({ location, perspectiveConfig }) => {
  const locationArr = location.pathname.split('/')
  let localID = locationArr.pop()
  const defaultTab = perspectiveConfig.defaultTab || 'table'
  const defaultInstancePageTab = perspectiveConfig.defaultInstancePageTab || 'table'
  if (localID === defaultTab || localID === defaultInstancePageTab) {
    localID = locationArr.pop() // pop again if tab id
  }
  perspectiveConfig.instancePageTabs.forEach(tab => {
    if (localID === tab.id) {
      localID = locationArr.pop() // pop again if tab id
    }
  })
  return localID
}

export const createURIfromLocalID = ({ localID, baseURI, URITemplate }) => {
  let uri = URITemplate
  uri = uri.replaceAll('<BASE_URI>', baseURI)
  uri = uri.replaceAll('<LOCAL_ID>', localID)
  return uri
}

export const processPortalConfig = async portalConfig => {
  const { layoutConfig, mapboxConfig } = portalConfig
  if (layoutConfig.mainPage) {
    const { bannerImage, bannerBackround } = layoutConfig.mainPage
    const { default: bannerImageURL } = await import(/* webpackMode: "eager" */ `../img/${bannerImage}`)
    layoutConfig.mainPage.bannerBackround = bannerBackround.replace('<BANNER_IMAGE_URL', bannerImageURL)
  }
  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN
  if (mapboxConfig && mapboxAccessToken) {
    mapboxConfig.mapboxAccessToken = mapboxAccessToken
  }
  if (layoutConfig.topBar.logoImage) {
    const { default: image } = await import(/* webpackMode: "eager" */ `../img/${layoutConfig.topBar.logoImage}`)
    layoutConfig.topBar.logoImage = image
  }
}

export const createPerspectiveConfig = async ({ portalID, searchPerspectives }) => {
  const perspectiveConfig = []
  for (const perspectiveID of searchPerspectives) {
    const { default: perspective } = await import(`../../configs/${portalID}/search_perspectives/${perspectiveID}.json`)
    perspectiveConfig.push(perspective)
  }
  for (const perspective of perspectiveConfig) {
    if (has(perspective, 'frontPageImage') && perspective.frontPageImage !== null) {
      const { default: image } = await import(/* webpackMode: "eager" */ `../img/${perspective.frontPageImage}`)
      perspective.frontPageImage = image
    }
    if (has(perspective, 'resultClasses')) {
      const tabs = []
      const instancePageTabs = []
      Object.keys(perspective.resultClasses).forEach(resultClass => {
        let resultClassConfig = perspective.resultClasses[resultClass]
        // handle the default resultClass of this perspective
        if (resultClass === perspective.id) {
          // instance pages
          if (has(resultClassConfig.instanceConfig, 'instancePageResultClasses')) {
            for (const instancePageResultClassID in resultClassConfig.instanceConfig.instancePageResultClasses) {
              const instancePageResultClassConfig = resultClassConfig.instanceConfig.instancePageResultClasses[instancePageResultClassID]
              const { tabID, tabPath, tabIcon } = instancePageResultClassConfig
              instancePageTabs.push({
                id: tabPath,
                value: tabID,
                icon: <MuiIcon iconName={tabIcon} />
              })
            }
          }
          // paginated results
          resultClassConfig = resultClassConfig.paginatedResultsConfig
        }
        if (has(resultClassConfig, 'tabID') && has(resultClassConfig, 'tabPath')) {
          const { tabID, tabPath, tabIcon } = resultClassConfig
          tabs.push({
            id: tabPath,
            value: tabID,
            icon: <MuiIcon iconName={tabIcon} />
          })
        }
      })
      perspective.tabs = sortBy(tabs, 'value')
      perspective.instancePageTabs = sortBy(instancePageTabs, 'value')
    }
    if (has(perspective, 'defaultActiveFacets')) {
      perspective.defaultActiveFacets = new Set(perspective.defaultActiveFacets)
    }
  }
  return perspectiveConfig
}

export const createPerspectiveConfigOnlyInfoPages = async ({ portalID, onlyInstancePagePerspectives }) => {
  const perspectiveConfigOnlyInfoPages = []
  for (const perspectiveID of onlyInstancePagePerspectives) {
    const { default: perspective } = await import(`../../configs/${portalID}/only_instance_pages/${perspectiveID}.json`)
    perspectiveConfigOnlyInfoPages.push(perspective)
  }
  for (const perspective of perspectiveConfigOnlyInfoPages) {
    const instancePageTabs = []
    const defaultResultClassConfig = perspective.resultClasses[perspective.id]
    if (has(defaultResultClassConfig.instanceConfig, 'instancePageResultClasses')) {
      for (const instancePageResultClassID in defaultResultClassConfig.instanceConfig.instancePageResultClasses) {
        const instancePageResultClassConfig = defaultResultClassConfig.instanceConfig.instancePageResultClasses[instancePageResultClassID]
        const { tabID, tabPath, tabIcon } = instancePageResultClassConfig
        instancePageTabs.push({
          id: tabPath,
          value: tabID,
          icon: <MuiIcon iconName={tabIcon} />
        })
      }
    }
    perspective.instancePageTabs = sortBy(instancePageTabs, 'value')
  }
  return perspectiveConfigOnlyInfoPages
}
