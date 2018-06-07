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
    overflowX: 'hidden',
  },
  table: {
    width: 600,
  },

});

const CustomTableCell = withStyles(theme => ({
  root: {
    paddingRight: 24,
  },
  head: {
    fontWeight: 600,
  },
  // body: {
  //   fontSize: 14,
  // },
}))(TableCell);

const SimpleTable = (props) => {
  const { classes, data } = props;

  return (
    <Paper className={classes.root}>
      {data.length > 0 &&
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Name</CustomTableCell>
              <CustomTableCell>Type</CustomTableCell>
              <CustomTableCell>Area</CustomTableCell>
              <CustomTableCell>Source</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(result => {
              return (
                <TableRow key={result.s}>
                  <CustomTableCell component="th" scope="row">
                    {result.label}
                  </CustomTableCell>
                  <CustomTableCell>{result.typeLabel}</CustomTableCell>
                  <CustomTableCell>{result.broaderAreaLabel}</CustomTableCell>
                  <CustomTableCell>{result.source}</CustomTableCell>
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
