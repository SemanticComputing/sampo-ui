import React from 'react'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import SemanticPortal from '../containers/SemanticPortal'

const theme = createTheme({
  palette: {
    primary: {
      main: '#212121'
    },
    secondary: {
      main: '#EB1806'
    }
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '1 rem'
      }
    },
    MuiAccordion: {
      root: {
        '&$expanded': {
          marginTop: 8,
          marginBottom: 8
        }
      }
    },
    MuiAccordionSummary: {
      content: {
        '&$expanded': {
          marginTop: 4
        }
      },
      expandIcon: {
        '&$expanded': {
          marginTop: -16
        }
      }
    },
    MuiButton: {
      endIcon: {
        marginLeft: 0
      }
    },
    MuiIconButton: {
      root: {
        padding: 4
      }
    },
    MuiTableCell: {
      sizeSmall: {
        paddingTop: 0,
        paddingBottom: 0
      }
    }
  }
})

const App = () => (
  <MuiThemeProvider theme={theme}>
    <SemanticPortal />
  </MuiThemeProvider>
)

export default App
