import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const SimpleTable = (props) => {
  const { classes, search } = props;
  
  return (
    <Paper className={classes.root}>
      {search.results.length > 0 &&
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {search.results.map(result => {
              return (
                <TableRow key={result.s}>
                  <TableCell component="th" scope="row">
                    {result.label[0].value}
                  </TableCell>
                  <TableCell>{result.typeLabel[0].value}</TableCell>
                  <TableCell>{result.broaderAreaLabel[0].value}</TableCell>
                  <TableCell>{result.source[0].value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      }
    </Paper>
  );
};

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
