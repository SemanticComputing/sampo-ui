import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import intl from 'react-intl-universal'

// helper function for converting a tab path into tab index value
const pathnameToTabValue = (location, tabs) => {
  const activeID = location.pathname.split('/').pop()
  let value = 0
  tabs.forEach(tab => {
    if (tab.id === activeID) {
      value = tab.value
    }
  })
  return value
}

/**
 * A component for generating view tabs for a faceted search perspective or an instance page.
 */
const PerspectiveTabs = props => {
  const { tabs, layoutConfig } = props
  const variant = tabs.length > 3 ? 'scrollable' : 'fullWidth'
  // const largeScreen = screenSize === 'xl'
  // const scrollButtons = tabs.length > 3 ? 'auto' : 'on'
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState(false) // false means that there are no active tabs

  useEffect(
    () => {
      // Use a delay before setting current tab value to get rid of the MUI warning:
      // "MUI: The `value` provided to the Tabs component is invalid.
      // The Tab with this `value` ("0") is not part of the document layout.
      // Make sure the tab item is present in the document or that it's not `display: none`.""
      const timer = setTimeout(() => setCurrentTab(pathnameToTabValue(location, tabs)), 1000)

      // clear timeout when component unmounts
      return () => {
        clearTimeout(timer)
      }
    },
    [location]
  )

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  return (
    <Paper
      sx={theme => ({
        flexGrow: 1,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      })}
    >
      <Tabs
        value={currentTab}
        onChange={handleChange}
        indicatorColor='secondary'
        textColor='secondary'
        variant={variant}
      >
        {tabs.map(tab =>
          <Tab
            sx={theme => ({
              paddingTop: theme.spacing(0.5),
              paddingBottom: theme.spacing(0.5),
              minHeight: layoutConfig.tabHeight,
              '& .MuiSvgIcon-root': {
                marginBottom: theme.spacing(0.5)
              }
            })}
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            label={intl.get(`tabs.${tab.id}`)}
            component={Link}
            to={tab.id}
            wrapped
          />
        )}
      </Tabs>
    </Paper>
  )
}

PerspectiveTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  screenSize: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export default PerspectiveTabs
