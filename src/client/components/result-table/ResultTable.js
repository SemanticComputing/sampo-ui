import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ResultTableHead from './ResultTableHead';
import Checkbox from '@material-ui/core/Checkbox';

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

const handleClick = (event, id) => {
  const { selected } = this.state;
  const selectedIndex = selected.indexOf(id);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, id);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1),
    );
  }

  this.setState({ selected: newSelected });
};

const columnData = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'type', numeric: false, disablePadding: true, label: 'Type' },
  { id: 'area', numeric: false, disablePadding: true, label: 'Area' },
  { id: 'source', numeric: false, disablePadding: true, label: 'Source' },
];

const ResultTable = (props) => {
  const { classes, data } = props;

  return (
    <Paper className={classes.root}>
      {data.length > 0 &&
        <Table className={classes.table}>
          <ResultTableHead
            numSelected={3}
            order='asc'
            orderBy='source'
            onSelectAllClick={() => {}}
            onRequestSort={() => {}}
            rowCount={data.length}
            columnData={columnData}
          />
          <TableBody>
            {data.map(n => {
              //const isSelected = this.isSelected(n.id);
              const isSelected = false;
              return (
                <TableRow
                  hover
                  onClick={event => handleClick(event, n.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={n.s}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none">
                    {n.label}
                  </TableCell>
                  <TableCell padding='none'>{n.typeLabel}</TableCell>
                  <TableCell padding='none'>{n.broaderAreaLabel}</TableCell>
                  <TableCell padding='none'>{n.source}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      }
    </Paper>
  );
};

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(ResultTable);
