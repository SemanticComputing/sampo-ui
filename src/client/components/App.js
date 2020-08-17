import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import SemanticPortal from '../containers/SemanticPortal'
import deepPurple from '@material-ui/core/colors/deepPurple'
import SimpleReactLightbox from 'simple-react-lightbox';

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
    MuiAccordion: {
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

const App = () => (
  <MuiThemeProvider theme={theme}>
    <SimpleReactLightbox>
      <SemanticPortal />
    </SimpleReactLightbox>
  </MuiThemeProvider>
)

export default App
