import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SemanticPortal from '../containers/SemanticPortal';
import deepPurple from '@material-ui/core/colors/deepPurple';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '1 rem'
      }
    }
  }
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <SemanticPortal />
  </MuiThemeProvider>
);

export default App;
