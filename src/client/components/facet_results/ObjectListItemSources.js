import React from 'react';
import PropTypes from 'prop-types';
import ObjectListItemLink from './ObjectListItemLink';
import { orderBy } from 'lodash';

const ObjectListItemSources = props => {
  let { data, externalLink } = props;
  data = Array.isArray(data) ? data : [ data ];
  data = orderBy(data, 'prefLabel');
  
  return (
    <sup>
      {data.map((source, index) =>
        <React.Fragment key={source.id}>
          <ObjectListItemLink
            externalLink={externalLink}
            data={source}
            label={source.prefLabel}
          />
          {!(data.length === index + 1) && <span>, </span>}
        </React.Fragment>
      )}
    </sup>
  );
};

ObjectListItemSources.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  externalLink: PropTypes.bool.isRequired
};

export default ObjectListItemSources;
