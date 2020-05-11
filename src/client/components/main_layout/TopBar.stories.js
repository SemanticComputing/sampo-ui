import React from 'react'
import TopBar from './TopBar'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { perspectiveConfig } from '../../configs/sampo/PerspectiveConfig'

export default {
  component: TopBar,
  title: 'Sampo-UI/main_layout/TopBar'
}

export const basic = props => {
  const fullTextSearch = useSelector(state => state.fullTextSearch)
  const options = useSelector(state => state.options)
  const location = useLocation()
  return (
    <TopBar
      rootUrl=''
      search={fullTextSearch}
      perspectives={perspectiveConfig}
      currentLocale={options.currentLocale}
      availableLocales={options.availableLocales}
      xsScreen={false}
      location={location}
      fetchFullTextResults={() => null}
      loadLocales={() => null}
      clearResults={() => null}
    />
  )
}
