import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import { ISOStringToDate } from './Dates';
import { orderBy, has } from 'lodash';
import ObjectListItem from './ObjectListItem';
import ObjectListItemEvent from './ObjectListItemEvent';

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

  const { sortValues, makeLink, externalLink, linkAsButton, columnId } = props;
  let { data } = props;

  const sortList = data => {
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
    return data;
  };

  const renderItem = ({ collapsed, itemData, isFirstValue = false }) => {
    if (columnId === 'event') {
      return (
        <React.Fragment>
          <ObjectListItemEvent
            data={itemData}
            isFirstValue={isFirstValue}
          />
          {collapsed && <span> ...</span>}
        </React.Fragment>

      );
    } else {
      return(
        <React.Fragment>
          <ObjectListItem
            data={itemData}
            makeLink={makeLink}
            externalLink={externalLink}
            linkAsButton={linkAsButton}
          />
          {collapsed && <span> ...</span>}
        </React.Fragment>
      );
    }
  };

  if (data == null || data === '-') {
    return '-';
  }
  else if (Array.isArray(data)) {
    data = sortList(data);
    return (
      <React.Fragment>
        {!props.expanded && renderItem({ collapsed: true, itemData: data[0], isFirstValue: true })}
        <Collapse in={props.expanded} timeout="auto" unmountOnExit>
          <ul className={props.classes.valueList}>
            {data.map(item =>
              <li key={item.id}>
                {renderItem({ collapsed: false, itemData: item })}
              </li>
            )}
          </ul>
        </Collapse>
      </React.Fragment>
    );
  } else {
    return renderItem({ collapsed: false, itemData: data, isFirstValue: true });
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
};

export default withStyles(styles)(ObjectList);
