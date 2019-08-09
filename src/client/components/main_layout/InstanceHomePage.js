import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { has } from 'lodash';
import ResultTableCell from '../facet_results/ResultTableCell';

const styles = () => ({
  root: {
    overflow: 'auto',
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    maxWidth: 600
  }
});

class InstanceHomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      instanceClass: '',
    };
  }


  componentDidMount = () => {
    let uri = '';
    let base = 'http://ldf.fi/mmm';
    const localID = this.props.routeProps.location.pathname.split('/').pop();
    switch(this.props.resultClass) {
      case 'manuscripts':
        this.setState({
          instanceClass: 'Manuscript'
        });
        uri = `${base}/manifestation_singleton/${localID}`;
    }
    this.props.fetchByURI({
      resultClass: this.props.resultClass,
      facetClass: null,
      variant: null,
      uri: uri
    });
  }


  render = () => {
    const { classes, data } = this.props;
    // console.log(data);
    return(
      <Paper className={classes.root}>
        {has(data, 'prefLabel') &&
          <div className={classes.content}>
            <Typography variant='h5'>{this.state.instanceClass}</Typography>
            <Typography variant='h6'>{data.prefLabel.prefLabel}</Typography>
            <Table className={classes.table}>
              <TableBody>
                <TableRow key={0}>
                  <TableCell>Author</TableCell>
                  <ResultTableCell
                    columnId='author'
                    data={data.author}
                    valueType='object'
                    makeLink={true}
                    sortValues={true}
                    numberedList={false}
                    minWidth={150}
                    container='cell'
                    expanded={true}
                  />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        }
      </Paper>
    );
  }
}

InstanceHomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  resultClass: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default withStyles(styles)(InstanceHomePage);
