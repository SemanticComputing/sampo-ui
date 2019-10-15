import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import ObjectListCollapsible from './ObjectListCollapsible';
import StringList from './StringList';

const ResultTableCell = props => {
  const { data, valueType, makeLink, externalLink, sortValues, numberedList, minWidth,
    container, columnId, expanded, linkAsButton, collapsedMaxWords } = props;
  let cellContent = null;
  let cellStyle = minWidth == null ? {} : { minWidth: minWidth };
  switch (valueType) {
    case 'object':
      cellContent =
        <ObjectListCollapsible
          data={data}
          makeLink={makeLink}
          externalLink={externalLink}
          sortValues={sortValues}
          numberedList={numberedList}
          columnId={columnId}
          expanded={expanded}
          linkAsButton={linkAsButton}
        />;
      break;
    case 'string':
      cellContent =
        <StringList
          data={data}
          expanded={expanded}
          collapsedMaxWords={collapsedMaxWords}
        />;
      break;
  }
  if (container === 'div') {
    return(
      <div>
        {cellContent}
      </div>
    );
  }
  if (container === 'cell') {
    return(
      <TableCell style={cellStyle}>
        {cellContent}
      </TableCell>
    );
  }
};

ResultTableCell.propTypes = {
  columnId: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  valueType: PropTypes.string.isRequired,
  makeLink: PropTypes.bool.isRequired,
  externalLink: PropTypes.bool.isRequired,
  sortValues: PropTypes.bool.isRequired,
  numberedList: PropTypes.bool.isRequired,
  minWidth: PropTypes.number,
  expanded: PropTypes.bool.isRequired,
  collapsedMaxWords: PropTypes.number,
};

export default ResultTableCell;
