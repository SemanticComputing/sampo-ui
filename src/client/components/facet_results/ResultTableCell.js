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

  // const eventRenderer = cell => {
  //   if (cell == null || cell === '-'){
  //     return '-';
  //   }
  //   if (Array.isArray(cell)) {
  //     cell = orderBy(cell, 'date');
  //     const items = cell.map((item, i) => {
  //       // TODO: remove when this is fixed in data
  //       if (Array.isArray(item.prefLabel)) {
  //         item.prefLabel = 'Transfer of Custody';
  //       }
  //       return (
  //         <li key={i}>
  //           {item.date == null ? <span className={props.classes.noDate}>No date</span> : item.date}
  //           {' '}
  //           <a
  //             target='_blank' rel='noopener noreferrer'
  //             href={item.dataProviderUrl}
  //           >
  //             {item.prefLabel}
  //           </a>
  //         </li>
  //       );
  //     });
  //     return (
  //       <ul className={props.classes.valueList}>
  //         {items}
  //       </ul>
  //     );
  //   } else {
  //     // TODO: remove when this is fixed in data
  //     if (Array.isArray(cell.prefLabel)) {
  //       cell.prefLabel = 'Transfer of Custody';
  //     }
  //     return (
  //       <span>
  //         {cell.date == null ? <span className={props.classes.noDate}>No date</span> : cell.date}
  //         {' '}
  //         <a
  //           target='_blank' rel='noopener noreferrer'
  //           href={cell.dataProviderUrl}
  //         >
  //           {cell.prefLabel}
  //         </a>
  //       </span>
  //     );
  //   }
  // };

  const ownerRenderer = (cell, makeLink, sortValues, numberedList, expanded) => {
    if (cell == null || cell === '-'){
      return '-';
    }
    if (Array.isArray(cell)) {
      if (!has(cell[0], 'order')) {
        return <ObjectList
          data={cell}
          makeLink={makeLink}
          sortValues={sortValues}
          numberedList={numberedList}
          expanded={expanded}
        />;
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
        <ObjectList
          data={cell}
          makeLink={makeLink}
          sortValues={sortValues}
          numberedList={numberedList}
          expanded={expanded}
        />;
      }
      return (
        <span>{cell.date}<br />{cell.location}</span>
      );
    }
  };

  const { data, valueType, makeLink, sortValues, numberedList, minWidth,
    container, columnId, expanded } = props;
  let cellContent = null;
  let cellStyle = minWidth == null ? {} : { minWidth: minWidth };
  switch (valueType) {
    case 'object':
    case 'event':
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
    case 'owner':
      cellContent = ownerRenderer(data, makeLink, sortValues, numberedList, expanded);
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
