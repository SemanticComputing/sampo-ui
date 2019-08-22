import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
// import Button from '@material-ui/core/Button';
// import { ISOStringToDate } from './Dates';
// import { Link } from 'react-router-dom';
// import { orderBy, has } from 'lodash';

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
  },
  stringContainer: {
    maxHeight: 200,
    overflow: 'auto'
  }
});

const StringList = props => {

  const createFirstValue = (data, isArray) => {
    if (isArray) {
      data = data[0];
    }
    if (props.collapsedMaxWords) {
      const wordCount = data.split(' ').length;
      if (wordCount > props.collapsedMaxWords) {
        data = data.trim().split(' ').splice(0, props.collapsedMaxWords).join(' ');
        data = `${data}...`;
      }
    }
    return(
      <div className={props.classes.stringContainer}>{data}</div>
    );
  };

  const createBasicList = data => {
    data = data.sort();
    return (
      <ul className={props.classes.valueList}>
        {data.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
  };

  let { data } = props;
  if (data == null || data === '-'){
    return '-';
  }
  const isArray = Array.isArray(data);
  return (
    <React.Fragment>
      {!props.expanded && createFirstValue(data, isArray)}
      <Collapse in={props.expanded} timeout="auto" unmountOnExit>
        {isArray && createBasicList(data)}
        {!isArray && <div className={props.classes.stringContainer}>{data}</div>}
      </Collapse>
    </React.Fragment>
  );
};

StringList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  expanded: PropTypes.bool.isRequired,
  collapsedMaxWords: PropTypes.number
};

export default withStyles(styles)(StringList);
