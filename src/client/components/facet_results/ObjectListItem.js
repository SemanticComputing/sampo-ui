import React from 'react';
import PropTypes from 'prop-types';
import ObjectListItemLink from './ObjectListItemLink';

const ObjectListItem = props => {
  const { data, makeLink, externalLink, linkAsButton, collapsed } = props;
  let label = Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel;
  return (
    <React.Fragment>
      {!makeLink && label}
      {makeLink &&
        <ObjectListItemLink
          data={data}
          label={label}
          externalLink={externalLink}
          linkAsButton={linkAsButton}
        />
      }
      {collapsed && ' ...'}
    </React.Fragment>
  );
};

ObjectListItem.propTypes = {
  data: PropTypes.object.isRequired,
  makeLink: PropTypes.bool.isRequired,
  externalLink: PropTypes.bool.isRequired,
  linkAsButton: PropTypes.bool,
  collapsed: PropTypes.bool.isRequired
};

export default ObjectListItem;
