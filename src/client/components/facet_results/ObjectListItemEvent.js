import React from 'react';
import PropTypes from 'prop-types';
import ObjectListItemLink from './ObjectListItemLink';

const ObjectListItemEvent = props => {
  const { data, collapsed } = props;
  let label = Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel;
  return (
    <React.Fragment>
      <ObjectListItemLink
        data={data}
        label={label}
      />
      {data.observedOwner &&
        <React.Fragment>
          {': '}
          {data.observedOwner}
        </React.Fragment>
      }
      {collapsed && ' ...'}
    </React.Fragment>
  );
};

ObjectListItemEvent.PropTypes = {
  data: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired
};

export default ObjectListItemEvent;
