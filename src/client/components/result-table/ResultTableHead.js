import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const ResultTableHead = (props) => {

  const createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  const { onSelectAllClick, order, orderBy, numSelected, rowCount, columnData } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {columnData.map(column => {
          return (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              padding={column.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === column.id ? order : false}
            >
              <Tooltip
                title="Sort"
                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
};

ResultTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnData: PropTypes.array.isRequired
};

export default ResultTableHead;
