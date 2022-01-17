import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import Grow from '@mui/material/Grow'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Link } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import intl from 'react-intl-universal'

const styles = theme => ({
  root: {
    flexGrow: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  tabRoot: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  tabLabelIcon: props => ({
    minHeight: props.layoutConfig.tabHeight
  })
})

/**
 * A component for generating view tabs for a faceted search perspective or an entity landing page.
 */
class PerspectiveTabs extends React.Component {
  constructor (props) {
    super(props)
    const value = this.pathnameToValue(this.props.routeProps.location.pathname)
    this.state = { value }
  }

  componentDidUpdate = prevProps => {
    const newPath = this.props.routeProps.location.pathname
    const oldPath = prevProps.routeProps.location.pathname
    if (newPath !== oldPath) {
      this.setState({ value: this.pathnameToValue(newPath) })
    }

    // Fix tabs indicator not showing on first load
    // https://stackoverflow.com/a/61205108
    const evt = document.createEvent('UIEvents')
    evt.initUIEvent('resize', true, false, window, 0)
    window.dispatchEvent(evt)
  }

  pathnameToValue = pathname => {
    const activeID = pathname.split('/').pop()
    let value = 0
    this.props.tabs.forEach(tab => {
      if (tab.id === activeID) {
        value = tab.value
      }
    })
    return value
  }

  handleChange = (event, value) => {
    this.setState({ value })
  };

  render () {
    const { classes, tabs } = this.props
    // const largeScreen = screenSize === 'xl'
    const variant = tabs.length > 3 ? 'scrollable' : 'fullWidth'
    const scrollButtons = tabs.length > 3 ? 'auto' : 'on'
    return (
      <Paper className={classes.root}>
        <Grow in>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor='secondary'
            textColor='secondary'
            variant={variant}
            scrollButtons={scrollButtons}
          >
            {tabs.map(tab =>
              <Tab
                classes={{
                  root: classes.tabRoot,
                  labelIcon: classes.tabLabelIcon,
                  wrapper: classes.tabWrapper
                }}
                key={tab.id}
                icon={tab.icon}
                label={intl.get(`tabs.${tab.id}`)}
                component={Link}
                to={tab.id}
                wrapped
              />
            )}
          </Tabs>

        </Grow>

      </Paper>
    )
  }
}

PerspectiveTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  routeProps: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  screenSize: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export const PerspectiveTabsComponent = PerspectiveTabs

export default withStyles(styles)(PerspectiveTabs)
