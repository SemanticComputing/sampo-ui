import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MapApp from '../containers/MapApp';
// import green from '@material-ui/core/colors/green';
// import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
// import red from '@material-ui/core/colors/red';
// import amber from '@material-ui/core/colors/amber';
// import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <MapApp />
  </MuiThemeProvider>
);

export default App;
