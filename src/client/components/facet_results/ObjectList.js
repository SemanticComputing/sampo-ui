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

  const createBasicItem = (data, isArray) => {
    const firstValue = data;
    const showDate = props.columnId === 'event';
    if (!props.makeLink) {
      return (
        <span>
          {showDate && firstValue.date == null ? <span className={props.classes.noDate}>No date</span> : firstValue.date}
          {showDate && ' '}
          {Array.isArray(firstValue.prefLabel) ?
            firstValue.prefLabel[0]
            : firstValue.prefLabel}
          {isArray && '...'}
        </span>
      );
    } else {
      const target = has(props.externalLink) && props.externalLink ? '_blank' : '_self';
      return (
        <React.Fragment>
          <React.Fragment>
            {showDate && firstValue.date == null ? <span className={props.classes.noDate}>No date</span> : firstValue.date}
            {showDate && ' '}
          </React.Fragment>
          <a
            target={target} rel='noopener noreferrer'
            href={firstValue.dataProviderUrl}
          >
            {Array.isArray(firstValue.prefLabel) ? firstValue.prefLabel[0] : firstValue.prefLabel}
            {isArray && '...'}
          </a>
        </React.Fragment>
      );
    }
  };

  const createBasicList = data => {
    const target = has(props.externalLink) && props.externalLink ? '_blank' : '_self';
    return data.map((item, i) =>
      <li key={i}>
        {props.makeLink &&
          <a
            target={target} rel='noopener noreferrer'
            href={item.dataProviderUrl}
          >
            {Array.isArray(item.prefLabel) ? item.prefLabel[0] : item.prefLabel}
          </a>
        }
        {!props.makeLink &&
          <span>{Array.isArray(item.prefLabel) ? item.prefLabel[0] : item.prefLabel}</span>
        }
      </li>
    );
  };

  const createEventList = data => {
    const target = has(props.externalLink) && props.externalLink ? '_blank' : '_self';
    return data.map((item, i) =>
      <li key={i}>
        {item.date == null ? <span className={props.classes.noDate}>No date</span> : item.date}
        {' '}
        <a
          target={target}  rel='noopener noreferrer'
          href={item.dataProviderUrl}
        >
          {Array.isArray(item.prefLabel) ? item.prefLabel[0] : item.prefLabel}
        </a>
      </li>
    );
  };

  // old code, sorting owners:
  // cell.map(item => {
  //   Array.isArray(item.order) ? item.earliestOrder = item.order[0] : item.earliestOrder = item.order;
  // });
  // cell.sort((a, b) => a.earliestOrder - b.earliestOrder);

  const { sortValues } = props;
  let { data } = props;
  if (data == null || data === '-') {
    return '-';
  }
  else if (Array.isArray(data)) {
    let listItems = null;
    let firstValue = null;
    if (has(props, 'columnId') && props.columnId.endsWith('Timespan')) {
      data = sortValues
        ? data.sort((a,b) => {
          a = has(a, 'start') ? ISOStringToDate(a.start) : ISOStringToDate(a.end);
          b = has(b, 'start') ? ISOStringToDate(b.start) : ISOStringToDate(b.end);
          // arrange from the most recent to the oldest
          return a > b ? 1 : a < b ? -1 : 0;
        })
        : data;
      listItems = createBasicList(data);
      firstValue = createBasicItem(data[0], true);
    } else if (props.columnId === 'event') {
      data = sortValues ? orderBy(data, 'date') : data;
      listItems = createEventList(data);
      firstValue = createBasicItem(data[0], true);
    }
    else {
      data = sortValues ? orderBy(data, 'prefLabel') : data;
      listItems = createBasicList(data);
      firstValue = createBasicItem(data[0], true);
    }
    return (
      <React.Fragment>
        {!props.expanded && firstValue}
        <Collapse in={props.expanded} timeout="auto" unmountOnExit>
          <ul className={props.classes.valueList}>
            {listItems}
          </ul>
        </Collapse>
      </React.Fragment>
    );
  } else {
    return createBasicItem(data, false);
  }
};

ObjectList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  makeLink: PropTypes.bool.isRequired,
  sortValues: PropTypes.bool.isRequired,
  numberedList: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  columnId: PropTypes.string.isRequired
} ;

export default withStyles(styles)(ObjectList);
