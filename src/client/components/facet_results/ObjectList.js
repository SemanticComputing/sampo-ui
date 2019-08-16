import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import { ISOStringToDate } from './Dates';
import { Link } from 'react-router-dom';
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
      return (
        <React.Fragment>
          <React.Fragment>
            {showDate && firstValue.date == null ? <span className={props.classes.noDate}>No date</span> : firstValue.date}
            {showDate && ' '}
          </React.Fragment>
          {createLink(firstValue.id, firstValue.dataProviderUrl, firstValue.prefLabel, isArray)}
        </React.Fragment>
      );
    }
  };

  const createLink = (id, dataProviderUrl, prefLabel, isArray) => {
    return (
      <React.Fragment>
        {props.externalLink &&
          <a
            target='_blank' rel='noopener noreferrer'
            href={id}
          >
            {Array.isArray(prefLabel) ? prefLabel[0] : prefLabel}
            {isArray && '...'}
          </a>
        }
        {!props.externalLink &&
          <Link to={dataProviderUrl}>
            {Array.isArray(prefLabel) ? prefLabel[0] : prefLabel}
            {isArray && '...'}
          </Link>
        }
      </React.Fragment>
    );
  };

  const createBasicList = data => {
    return data.map((item, i) => {
      //const hasSource = has(item, 'source');
      return(
        <li key={i}>
          {props.makeLink && createLink(item.id, item.dataProviderUrl, item.prefLabel, false)}
          {!props.makeLink && <span>{Array.isArray(item.prefLabel) ? item.prefLabel[0] : item.prefLabel}</span>}
          { /* {hasSource && <sup>{item.source.prefLabel}</sup>} */ }
        </li>
      );
    }

    );
  };

  const createEventList = data => {
    return data.map((item, i) =>
      <li key={i}>
        {item.date == null ? <span className={props.classes.noDate}>No date</span> : item.date}
        {' '}
        {createLink(item.id, item.dataProviderUrl, item.prefLabel, false)}
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
  //console.log(data)
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
  externalLink: PropTypes.bool.isRequired,
  sortValues: PropTypes.bool.isRequired,
  numberedList: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  columnId: PropTypes.string.isRequired,
} ;

export default withStyles(styles)(ObjectList);
