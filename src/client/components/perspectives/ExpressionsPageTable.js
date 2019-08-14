import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ResultTableCell from '../facet_results/ResultTableCell';

const styles = theme => ({
  root: {
    overflow: 'auto',
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    padding: theme.spacing(1),
    minWidth: 800,
    maxWidth: 1200
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
});

class ExpressionsPageTable extends React.Component {

  render = () => {
    const { classes, data } = this.props;
    return(
      <Table className={classes.table}>
        <TableBody>
          <TableRow key='manuscript'>
            <TableCell>Manuscript</TableCell>
            <ResultTableCell
              columnId='manuscript'
              data={data.manuscript}
              valueType='object'
              makeLink={true}
              externalLink={false}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='language'>
            <TableCell>Language</TableCell>
            <ResultTableCell
              columnId='language'
              data={data.language}
              valueType='object'
              makeLink={true}
              externalLink={true}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='source'>
            <TableCell>Source</TableCell>
            <ResultTableCell
              columnId='source'
              data={data.source}
              valueType='object'
              makeLink={true}
              externalLink={true}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

ExpressionsPageTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExpressionsPageTable);
