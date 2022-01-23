import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AdapterMoment from '@mui/lab/AdapterMoment'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import 'moment/locale/fi'
import SemanticPortal from '../containers/SemanticPortal'
import portalConfig from '../../configs/portalConfig.json'

const { colorPalette, reducedHeightBreakpoint, hundredPercentHeightBreakPoint, topBar } = portalConfig.layoutConfig

const muiDefaultBreakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536
}

const defaultTheme = createTheme()

const theme = createTheme({
  palette: {
    primary: {
      main: colorPalette.primary.main
    },
    secondary: {
      main: colorPalette.secondary.main
    }
  },
  breakpoints: {
    values: {
      ...muiDefaultBreakpoints,
      reducedHeight: reducedHeightBreakpoint,
      hundredPercentHeight: hundredPercentHeightBreakPoint
    }
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        regular: {
          [defaultTheme.breakpoints.down(reducedHeightBreakpoint)]: {
            minHeight: topBar.reducedHeight
          },
          [defaultTheme.breakpoints.up(reducedHeightBreakpoint)]: {
            minHeight: topBar.defaultHeight
          }
        }
      }
    },
    MuiCircularProgress: {
      defaultProps: {
        thickness: 5
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 4
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1rem'
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&.Mui-expanded': {
            marginTop: 8,
            marginBottom: 8
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          paddingLeft: 8,
          paddingRight: 8,
          minHeight: 40
        },
        content: {
          marginTop: 4,
          marginBottom: 4,
          '&.Mui-expanded': {
            marginTop: 0,
            marginBottom: 0
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        endIcon: {
          marginLeft: 0
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        sizeSmall: {
          paddingTop: 0,
          paddingBottom: 0
        }
      }
    }
  }
})

const App = () => (
  <LocalizationProvider dateAdapter={AdapterMoment}>
    <ThemeProvider theme={theme}>
      <SemanticPortal />
    </ThemeProvider>
  </LocalizationProvider>
)

export default App
