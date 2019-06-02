import React from 'react';
import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';

const MaterialTableFacetResultsHead = props => {
  const { columns, sortBy, sortDirection, onSortBy } = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell
          key='detail-panel-column'
          padding='none'
        >
        </TableCell>
        {columns.map(column => {
          return (
            <TableCell
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

MaterialTableFacetResultsHead.propTypes = {
  //classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pagesize: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  routeProps: PropTypes.object.isRequired,
};

export default MaterialTableFacetResultsHead;
