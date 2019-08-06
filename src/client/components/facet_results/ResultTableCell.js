import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import TableCell from '@material-ui/core/TableCell';
import ObjectList from './ObjectList';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  valueList: {
    paddingLeft: 20,
    maxHeight: 200,
    overflow: 'auto'
  },
  valueListNoBullets: {
    listStyle: 'none',
    paddingLeft: 0
  },
  noDate: {
    marginRight: 20
  }
});

const ResultTableCell = props => {

  const stringListRenderer = cell => {
    if (cell == null || cell === '-'){
      return '-';
    }
    if (Array.isArray(cell)) {
      cell = cell.sort();
      return (
        <ul className={props.classes.valueList}>
          {cell.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    } else {
      return <span>{cell}</span>;
    }
  };

  const { data, valueType, makeLink, sortValues, numberedList, minWidth,
    container, columnId, expanded } = props;
  let cellContent = null;
  let cellStyle = minWidth == null ? {} : { minWidth: minWidth };
  switch (valueType) {
    case 'object':
      cellContent =
        <ObjectList
          data={data}
          makeLink={makeLink}
          sortValues={sortValues}
          numberedList={numberedList}
          columnId={columnId}
          expanded={expanded}
        />;
      break;
    case 'string':
      cellContent = stringListRenderer(data);
      break;
  }
  if (container === 'div') {
    return(
      <div>
        {cellContent}
      </div>
    );
  }
  if (container === 'cell') {
    return(
      <TableCell style={cellStyle}>
        {cellContent}
      </TableCell>
    );
  }
};

ResultTableCell.propTypes = {
  classes: PropTypes.object.isRequired,
  columnId: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
  valueType: PropTypes.string.isRequired,
  makeLink: PropTypes.bool.isRequired,
  sortValues: PropTypes.bool.isRequired,
  numberedList: PropTypes.bool.isRequired,
  minWidth: PropTypes.number,
  expanded: PropTypes.bool.isRequired
};

export default withStyles(styles)(ResultTableCell);
