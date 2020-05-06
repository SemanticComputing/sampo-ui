import { addDecorator } from '@storybook/react'
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import intl from 'react-intl-universal'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import deepPurple from '@material-ui/core/colors/deepPurple'
import localeEN from '../src/client/translations/sampo/localeEN'
import localeFI from '../src/client/translations/sampo/localeFI'
import localeSV from '../src/client/translations/sampo/localeSV'
import reducer from '../src/client/reducers'

import '../src/client/index.css'

const store = createStore(reducer)

intl.init({
  currentLocale: 'en',
  locales: {
    en: localeEN,
    fi: localeFI,
    sv: localeSV
  }
})

const theme = createMuiTheme({
  palette: {
    primary: deepPurple
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '1 rem'
      }
    },
    MuiExpansionPanel: {
      root: {
        '&$expanded': {
          marginTop: 8,
          marginBottom: 8
        }
      }
    },
    MuiButton: {
      endIcon: {
        marginLeft: 0
      }
    }
  }
})

addDecorator(Story => (
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <MuiThemeProvider theme={theme}>
        <Story />
      </MuiThemeProvider>
    </Router>
  </Provider>
))
