import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ResultTableCell from '../facet_results/ResultTableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import has from 'lodash';

const styles = theme => ({
  instanceTable: {
    //maxWidth: 800,
    //width: '100%',
    height: '100%',
    borderTop: '1px solid rgba(224, 224, 224, 1);',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  sahaButton: {
    margin: theme.spacing(2),
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelCell: {
    width: 240,
  }
});



const InstanceHomePageTable = props => {
  const { classes, data, tableRows } = props;
  return (
    <Table className={classes.instanceTable}>
      <TableBody>
        {tableRows.map(row => {
          return (
            <TableRow key={row.id}>
              <TableCell className={classes.labelCell}>
                {row.label}
                <Tooltip
                  title={row.desc}
                  enterDelay={300}
                >
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <ResultTableCell
                columnId={row.id}
                data={data[row.id]}
                valueType={row.valueType}
                makeLink={row.makeLink}
                externalLink={row.externalLink}
                sortValues={row.sortValues}
                numberedList={row.numberedList}
                container='cell'
                expanded={true}
                linkAsButton={has(row, 'linkAsButton')
                  ? row.linkAsButton
                  : null
                }
                collapsedMaxWords={has(row, 'collapsedMaxWords')
                  ? row.collapsedMaxWords
                  : null
                }
                showSource={has(row, 'showSource')
                  ? row.showSource
                  : null
                }
                sourceExternalLink={has(row, 'sourceExternalLink')
                  ? row.sourceExternalLink
                  : null
                }
              />
            </TableRow>
          );
        }
        )}
      </TableBody>
    </Table>
  );
};

InstanceHomePageTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  tableRows: PropTypes.array.isRequired
};

export default withStyles(styles)(InstanceHomePageTable);
