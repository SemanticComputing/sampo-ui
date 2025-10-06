import { has, sortBy } from 'lodash'
import MuiIcon from '../components/main_layout/MuiIcon'
import React from 'react'

export const configHelpers = (getConfigJsonFile, getConfigImgFile) => {
  const processPortalConfig = async portalConfig => {
    const { layoutConfig, mapboxConfig } = portalConfig
    if (layoutConfig.mainPage) {
      const { bannerImage, bannerBackround } = layoutConfig.mainPage
      const bannerImageURL = await getConfigImgFile(bannerImage)
      layoutConfig.mainPage.bannerBackround = bannerBackround.replace('<BANNER_IMAGE_URL>', bannerImageURL)
    }
    const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN
    if (mapboxConfig && mapboxAccessToken) {
      mapboxConfig.mapboxAccessToken = mapboxAccessToken
    }
    if (layoutConfig.topBar.logoImage) {
      layoutConfig.topBar.logoImageUrl = await getConfigImgFile(layoutConfig.topBar.logoImage)
    }
    if (layoutConfig.topBar.logoImageSecondary) {
      layoutConfig.topBar.logoImageSecondaryUrl = await getConfigImgFile(layoutConfig.topBar.logoImageSecondary)
    }
  }

  const createPerspectiveConfigs = async (searchPerspectives) => {
    const perspectiveConfig = []
    for (const perspectiveID of searchPerspectives) {
      const perspective = await getConfigJsonFile(`search_perspectives/${perspectiveID}.json`)
      perspectiveConfig.push(perspective)
    }
    for (const perspective of perspectiveConfig) {
      if (has(perspective, 'frontPageImage') && perspective.frontPageImage !== null) {
        perspective.frontPageImageUrl = await getConfigImgFile(perspective.frontPageImage)
      }
      if (has(perspective, 'resultClasses')) {
        const tabs = []
        const instancePageTabs = []
        Object.keys(perspective.resultClasses).forEach(resultClass => {
          let resultClassConfig = perspective.resultClasses[resultClass]
          // handle the default resultClass of this perspective
          if (resultClass === perspective.id) {
            // default resultClass, instance pages
            if (has(resultClassConfig.instanceConfig, 'instancePageResultClasses')) {
              for (const instancePageResultClassID in resultClassConfig.instanceConfig.instancePageResultClasses) {
                const instancePageResultClassConfig = resultClassConfig.instanceConfig.instancePageResultClasses[instancePageResultClassID]
                if (!instancePageResultClassConfig.hideTab && has(instancePageResultClassConfig, 'tabID') && has(instancePageResultClassConfig, 'tabPath')) {
                  const { tabID, tabPath, tabIcon } = instancePageResultClassConfig
                  instancePageTabs.push({
                    id: tabPath,
                    value: tabID,
                    icon: <MuiIcon iconName={tabIcon} />
                  })
                }
              }
            }
            // default resultClass, paginated results tab is added next
            resultClassConfig = resultClassConfig.paginatedResultsConfig
          }
          if (resultClassConfig && has(resultClassConfig, 'tabID') && !resultClassConfig.hideTab && has(resultClassConfig, 'tabPath')) {
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

  const createPerspectiveConfigOnlyInfoPages = async (onlyInstancePagePerspectives) => {
    const perspectiveConfigOnlyInfoPages = []
    for (const perspectiveID of onlyInstancePagePerspectives) {
      const perspective = await getConfigJsonFile(`only_instance_pages/${perspectiveID}.json`)
      perspectiveConfigOnlyInfoPages.push(perspective)
    }
    for (const perspective of perspectiveConfigOnlyInfoPages) {
      const instancePageTabs = []
      const defaultResultClassConfig = perspective.resultClasses[perspective.id]
      if (has(defaultResultClassConfig.instanceConfig, 'instancePageResultClasses')) {
        for (const instancePageResultClassID in defaultResultClassConfig.instanceConfig.instancePageResultClasses) {
          const instancePageResultClassConfig = defaultResultClassConfig.instanceConfig.instancePageResultClasses[instancePageResultClassID]
          if (!instancePageResultClassConfig.hideTab && has(instancePageResultClassConfig, 'tabID') && has(instancePageResultClassConfig, 'tabPath')) {
            const { tabID, tabPath, tabIcon } = instancePageResultClassConfig
            instancePageTabs.push({
              id: tabPath,
              value: tabID,
              icon: <MuiIcon iconName={tabIcon} />
            })
          }
        }
      }
      perspective.instancePageTabs = sortBy(instancePageTabs, 'value')
    }
    return perspectiveConfigOnlyInfoPages
  }

  return {
    processPortalConfig,
    createPerspectiveConfigOnlyInfoPages,
    createPerspectiveConfigs
  }
}
