import React from 'react';
import PropTypes from 'prop-types';

let ManuscriptList = (props) => {
  const { manuscripts } = props;
  let items = '';
  if (Array.isArray(manuscripts)) {
    items = manuscripts.map(m => <li key={m.id}><a target="_blank" rel="noopener noreferrer" href={m.url}>{m.url}</a></li>);
  } else {
    items = <li><a target="_blank" rel="noopener noreferrer" href={manuscripts.url}>{manuscripts.url}</a></li>;
  }
  return(
    <ul>
      {items}
    </ul>
  );
};

ManuscriptList.propTypes = {
  //classes: PropTypes.object.isRequired,
  manuscripts:  PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default ManuscriptList;
