import React from 'react'
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles'
import AdapterMoment from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
// import 'moment/locale/fi'
import SemanticPortal from '../containers/SemanticPortal'
import portalConfig from '../../configs/portalConfig.json'

const { colorPalette } = portalConfig.layoutConfig

const theme = createTheme({
  palette: {
    primary: {
      main: colorPalette.primary.main
    },
    secondary: {
      main: colorPalette.secondary.main
    }
  },
  components: {
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
  <LocalizationProvider dateAdapter={AdapterMoment}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SemanticPortal />
      </ThemeProvider>
    </StyledEngineProvider>
  </LocalizationProvider>
)

export default App
