import React from 'react';
import PropTypes from 'prop-types';
import { orderBy, has } from 'lodash';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
//import Typography from '@material-ui/core/Typography';

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

  const ISOStringToDate = str => {
    let year;
    let month;
    let day;
    if (str.charAt(0) == '-') {
      year = parseInt(str.substring(0,5));
      month = parseInt(str.substring(7,8));
      day = parseInt(str.substring(10,11));
    } else {
      year = parseInt(str.substring(0,4));
      month = parseInt(str.substring(6,7));
      day = parseInt(str.substring(9,10));
    }
    return new Date(year, month, day);
  };

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

  const objectListRenderer = (cell, makeLink, sortValues, numberedList) => {
    if (cell == null || cell === '-'){
      return '-';
    }
    else if (Array.isArray(cell)) {
      if (props.columnId == 'productionTimespan') {
        cell = sortValues
          ? cell.sort((a,b) => {
            a = has(a, 'start') ? ISOStringToDate(a.start) : ISOStringToDate(a.end);
            b = has(b, 'start') ? ISOStringToDate(b.start) : ISOStringToDate(b.end);
            // arrange from the most recent to the oldest
            return a > b ? 1 : a < b ? -1 : 0;
          })
          : cell;
      } else {
        cell = sortValues ? orderBy(cell, 'prefLabel') : cell;
      }
      const firstValue = cell[0];
      const listItems = cell.map((item, i) =>
        <li key={i}>
          {makeLink &&
            <a
              target='_blank' rel='noopener noreferrer'
              href={item.dataProviderUrl}
            >
              {item.prefLabel}
            </a>
          }
          {!makeLink && item.prefLabel}
        </li>
      );
      if (numberedList) {
        return (
          <ol className={props.classes.valueList}>
            {listItems}
          </ol>
        );
      } else {
        return (
          <React.Fragment>
            {!props.expanded && !makeLink &&
              <span>{firstValue.prefLabel} ...</span>}
            {!props.expanded && makeLink &&
              <a
                target='_blank' rel='noopener noreferrer'
                href={firstValue.dataProviderUrl}
              >
                {firstValue.prefLabel} ...
              </a>
            }
            <Collapse in={props.expanded} timeout="auto" unmountOnExit>
              <ul className={props.classes.valueList}>
                {listItems}
              </ul>
            </Collapse>
          </React.Fragment>
        );
      }
    } else if (makeLink) {
      return (
        <a
          target='_blank' rel='noopener noreferrer'
          href={cell.dataProviderUrl}
        >
          {cell.prefLabel}
        </a>
      );
    } else {
      return (
        <span>{cell.prefLabel}</span>
      );
    }
  };

  const eventRenderer = cell => {
    if (cell == null || cell === '-'){
      return '-';
    }
    if (Array.isArray(cell)) {
      cell = orderBy(cell, 'date');
      const items = cell.map((item, i) => {
        // TODO: remove when this is fixed in data
        if (Array.isArray(item.prefLabel)) {
          item.prefLabel = 'Transfer of Custody';
        }
        return (
          <li key={i}>
            {item.date == null ? <span className={props.classes.noDate}>No date</span> : item.date}
            {' '}
            <a
              target='_blank' rel='noopener noreferrer'
              href={item.dataProviderUrl}
            >
              {item.prefLabel}
            </a>
          </li>
        );
      });
      return (
        <ul className={props.classes.valueList}>
          {items}
        </ul>
      );
    } else {
      // TODO: remove when this is fixed in data
      if (Array.isArray(cell.prefLabel)) {
        cell.prefLabel = 'Transfer of Custody';
      }
      return (
        <span>
          {cell.date == null ? <span className={props.classes.noDate}>No date</span> : cell.date}
          {' '}
          <a
            target='_blank' rel='noopener noreferrer'
            href={cell.dataProviderUrl}
          >
            {cell.prefLabel}
          </a>
        </span>
      );
    }
  };

  const ownerRenderer = (cell, makeLink, sortValues, numberedList) => {
    if (cell == null || cell === '-'){
      return '-';
    }
    if (Array.isArray(cell)) {
      if (!has(cell[0], 'order')) {
        return objectListRenderer(cell, makeLink, sortValues, numberedList);
      }
      cell.map(item => {
        Array.isArray(item.order) ? item.earliestOrder = item.order[0] : item.earliestOrder = item.order;
      });
      cell.sort((a, b) => a.earliestOrder - b.earliestOrder);

      const items = cell.map((item, i) => {
        return (
          <li key={i}>
            <span>{Array.isArray(item.order) ? item.order.toString() : item.order}. </span>
            <a
              target='_blank' rel='noopener noreferrer'
              href={item.dataProviderUrl}
            >
              {item.prefLabel}
            </a>
          </li>
        );
      });
      return (
        <ul className={props.classes.valueListNoBullets}>
          {items}
        </ul>
      );
    } else {
      if (!has(cell, 'order')) {
        return objectListRenderer(cell, makeLink, sortValues, numberedList);
      }
      return (
        <span>{cell.date}<br />{cell.location}</span>
      );
    }
  };

  const { data, valueType, makeLink, sortValues, numberedList, minWidth,
    container } = props;
  let renderer = null;
  let cellStyle = minWidth == null ? {} : { minWidth: minWidth };
  switch (valueType) {
    case 'object':
      renderer = objectListRenderer;
      break;
    case 'string':
      renderer = stringListRenderer;
      break;
    case 'event':
      renderer = eventRenderer;
      break;
    case 'owner':
      renderer = ownerRenderer;
      break;
  }
  if (container === 'div') {
    return(
      <div>
        {renderer(data, makeLink, sortValues, numberedList)}
      </div>
    );
  }
  if (container === 'cell') {
    return(
      <TableCell style={cellStyle}>
        {renderer(data, makeLink, sortValues, numberedList)}
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
