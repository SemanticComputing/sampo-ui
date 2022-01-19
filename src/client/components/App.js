import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AdapterMoment from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
// import 'moment/locale/fi'
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
          '&.MuiAccordion-root.Mui-expanded': {
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
          '&.MuiAccordionSummary-root.Mui-expanded': {
            minHeight: 48
          }
        },
        content: {
          marginTop: 8,
          marginBottom: 8,
          '&.MuiAccordionSummary-content.Mui-expanded': {
            marginTop: 0,
            marginBottom: 0
          }
        }
        // expandIcon: {
        //   '&$expanded': {
        //     marginTop: -16
        //   }
        // }
      }
    }
    // MuiButton: {
    //   endIcon: {
    //     marginLeft: 0
    //   }
    // },
    // MuiTableCell: {
    //   sizeSmall: {
    //     paddingTop: 0,
    //     paddingBottom: 0
    //   }
    // }
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
