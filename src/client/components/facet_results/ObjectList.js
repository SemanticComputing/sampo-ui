import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import { ISOStringToDate } from './Dates';
import { orderBy, has } from 'lodash';

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

const ObjectList = props => {
  const { makeLink, sortValues, numberedList } = props;
  let { data } = props;
  if (data == null || data === '-'){
    return '-';
  }
  else if (Array.isArray(data)) {
    if (has(props, 'columnId') && props.columnId.endsWith('Timespan')) {
      data = sortValues
        ? data.sort((a,b) => {
          a = has(a, 'start') ? ISOStringToDate(a.start) : ISOStringToDate(a.end);
          b = has(b, 'start') ? ISOStringToDate(b.start) : ISOStringToDate(b.end);
          // arrange from the most recent to the oldest
          return a > b ? 1 : a < b ? -1 : 0;
        })
        : data;
    } else {
      data = sortValues ? orderBy(data, 'prefLabel') : data;
    }
    const firstValue = data[0];
    const listItems = data.map((item, i) =>
      <li key={i}>
        {makeLink &&
          <a
            target='_blank' rel='noopener noreferrer'
            href={item.dataProviderUrl}
          >
            {Array.isArray(item.prefLabel) ? item.prefLabel[0] : item.prefLabel}
          </a>
        }
        {!makeLink &&
          <span>{Array.isArray(item.prefLabel) ? item.prefLabel[0] : item.prefLabel}</span>
        }
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
            <span>{Array.isArray(firstValue.prefLabel) ? firstValue.prefLabel[0] : firstValue.prefLabel} ...</span>}
          {!props.expanded && makeLink &&
            <a
              target='_blank' rel='noopener noreferrer'
              href={firstValue.dataProviderUrl}
            >
              {Array.isArray(firstValue.prefLabel) ? firstValue.prefLabel[0] : firstValue.prefLabel} ...
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
        href={data.dataProviderUrl}
      >
        {Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel}
      </a>
    );
  } else {
    return (
      <span>{Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel}</span>
    );
  }
};

ObjectList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  makeLink: PropTypes.bool.isRequired,
  sortValues: PropTypes.bool.isRequired,
  numberedList: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  columnId: PropTypes.string
} ;

export default withStyles(styles)(ObjectList);
