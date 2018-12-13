import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MapApp from '../containers/MapApp';
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
    <MapApp />
  </MuiThemeProvider>
);

export default App;
