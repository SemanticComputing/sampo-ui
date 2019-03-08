import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SemanticPortal from '../containers/SemanticPortal';
import deepPurple from '@material-ui/core/colors/deepPurple';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
  },
  typography: {
    useNextVariants: true,
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <SemanticPortal />
  </MuiThemeProvider>
);

export default App;
