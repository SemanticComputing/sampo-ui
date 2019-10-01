import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
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
  dateContainer: {
    width: 180,
    display: 'inline-block'
  }
});

const ObjectList = props => {

  const createBasicItem = ({ data, collapsed, firstValue }) => {
    let date = '';
    let observedOwner = '';
    if (props.columnId === 'event') {
      date =
        <span className={firstValue ? null : props.classes.dateContainer}>
          {data.date == null ? 'No date ' : `${data.date} `}
        </span>;
      if (data.observedOwner) {  // currently no separate class for provenance events
        observedOwner = createLink({
          id: data.observedOwner.id,
          dataProviderUrl: data.observedOwner.dataProviderUrl,
          prefLabel: data.observedOwner.prefLabel,
          collapsed: false
        });
      }
    }
    return (
      <span>
        {date}
        {!props.makeLink &&
          <React.Fragment>
            {Array.isArray(data.prefLabel) ?
              data.prefLabel[0]
              : data.prefLabel}
            {collapsed && ' ...'}
          </React.Fragment>
        }
        {props.makeLink &&
          <React.Fragment>
            {createLink({
              id: data.id,
              dataProviderUrl: data.dataProviderUrl,
              prefLabel: data.prefLabel,
              collapsed
            })}
          </React.Fragment>
        }
        {data.observedOwner &&
          <React.Fragment>
            {': '}
            {observedOwner}
          </React.Fragment>
        }
      </span>
    );
  };

  const createLink = ({ id, dataProviderUrl, prefLabel, collapsed }) => {
    return (
      <React.Fragment>
        {props.externalLink && props.linkAsButton == null &&
          <a
            target='_blank' rel='noopener noreferrer'
            href={dataProviderUrl}
          >
            {Array.isArray(prefLabel) ? prefLabel[0] : prefLabel}
          </a>
        }
        {props.externalLink && props.linkAsButton &&
          <Button
            variant='contained'
            target='_blank'
            rel='noopener noreferrer'
            href={id}
          >
            {Array.isArray(prefLabel) ? prefLabel[0] : prefLabel}
          </Button>
        }
        {!props.externalLink &&
          <Link to={dataProviderUrl}>
            {Array.isArray(prefLabel) ? prefLabel[0] : prefLabel}
          </Link>
        }
        {collapsed && <span> ...</span>}
      </React.Fragment>
    );
  };

  const createBasicList = data => {
    return data.map((item, i) => {
      const hasSource = has(item, 'source');
      return(
        <li key={i}>
          {createBasicItem({ data: item, collapsed: false, firstValue: false })}
          {hasSource && <sup>{item.source.prefLabel}</sup>}
        </li>
      );
    }

    );
  };

  const { sortValues } = props;
  let { data } = props;
  // if (props.columnId === 'event') {
  //   console.log(data)
  // }
  if (data == null || data === '-') {
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
    } else if (props.columnId === 'event') {
      data = sortValues ? orderBy(data, 'date') : data;
    }
    else {
      data = sortValues ? orderBy(data, 'prefLabel') : data;
    }
    return (
      <React.Fragment>
        {!props.expanded && createBasicItem({
          data: data[0],
          collapsed: true,
          firstValue: true
        })}
        <Collapse in={props.expanded} timeout="auto" unmountOnExit>
          <ul className={props.classes.valueList}>
            {createBasicList(data)}
          </ul>
        </Collapse>
      </React.Fragment>
    );
  } else {
    return createBasicItem({ data, collapsed: false, firstValue: true });
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
  linkAsButton: PropTypes.bool
} ;

export default withStyles(styles)(ObjectList);

// old code, sorting owners:
// cell.map(item => {
//   Array.isArray(item.order) ? item.earliestOrder = item.order[0] : item.earliestOrder = item.order;
// });
// cell.sort((a, b) => a.earliestOrder - b.earliestOrder);
