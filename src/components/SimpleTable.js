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
    minWidth: 750,
  },
});

const SimpleTable = (props) => {
  const { classes, data } = props;

  return (
    <Paper className={classes.root}>
      {data.length > 0 &&
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
            {data.map(result => {
              return (
                <TableRow key={result.s}>
                  <TableCell component="th" scope="row">
                    {result.label}
                  </TableCell>
                  <TableCell>{result.typeLabel}</TableCell>
                  <TableCell>{result.broaderAreaLabel}</TableCell>
                  <TableCell>{result.source}</TableCell>
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
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(SimpleTable);
