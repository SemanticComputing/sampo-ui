import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ObjectListItemLink from './ObjectListItemLink';


const styles = () => ({
  dateContainer: {
    width: 180,
    display: 'inline-block'
  }
});

const ObjectListItemEvent = props => {
  const { data, isFirstValue } = props;
  let label = Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel;
  return (
    <React.Fragment>
      <span className={isFirstValue ? null : props.classes.dateContainer}>
        {data.date == null ? 'No date ' : `${data.date} `}
      </span>
      <ObjectListItemLink
        data={data}
        label={label}
        externalLink={false}
      />
      {data.observedOwner &&
        <React.Fragment>
          {': '}
          <ObjectListItemLink
            data={data.observedOwner}
            label={data.observedOwner.prefLabel}
            externalLink={false}
          />
        </React.Fragment>
      }
    </React.Fragment>
  );
};

ObjectListItemEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  isFirstValue: PropTypes.bool.isRequired
};

export default withStyles(styles)(ObjectListItemEvent);
