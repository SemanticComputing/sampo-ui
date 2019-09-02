import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';

const styles = theme => ({
  headerCol: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1
  }
});

const ResultTableHead = props => {
  const { classes, columns, sortBy, sortDirection, onSortBy } = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.headerCol} key={'empty'} />
        {columns.map(column => {
          if (column.onlyOnInstancePage) { return null; }
          return (
            <TableCell
              className={classes.headerCol}
              key={column.id}
              sortDirection={sortBy === column.id ? sortDirection : false}
            >
              <Tooltip
                title={`Sort by ${column.label}`}
                enterDelay={300}
              >
                <TableSortLabel
                  active={sortBy === column.id}
                  direction={sortDirection}
                  hideSortIcon={true}
                  onClick={onSortBy(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
              <Tooltip
                title={column.desc}
                enterDelay={300}
              >
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

ResultTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  routeProps: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultTableHead);
