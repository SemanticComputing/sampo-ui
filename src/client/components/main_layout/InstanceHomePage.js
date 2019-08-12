import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { has } from 'lodash';
import ManuscriptsPageTable from '../perspectives/ManuscriptsPageTable';

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

class InstanceHomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      instanceHeading: '',
    };
  }


  componentDidMount = () => {
    let uri = '';
    let base = 'http://ldf.fi/mmm';
    const localID = this.props.routeProps.location.pathname.split('/').pop();
    switch(this.props.resultClass) {
      case 'manuscripts':
        this.setState({
          instanceHeading: 'Manuscript',
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

  renderTable = () => {
    let tableEl = null;
    if (this.state.instanceClass !== '') {
      switch (this.state.instanceHeading) {
        case 'Manuscript':
          tableEl = <ManuscriptsPageTable data={this.props.data} />;
      }
    }
    return tableEl;
  }


  render = () => {
    const { classes, data } = this.props;
    // console.log(data);
    return(
      <div className={classes.root}>
        {has(data, 'prefLabel') &&
          <Paper className={classes.content}>
            <Typography variant='h4'>{this.state.instanceHeading}</Typography>
            <Divider className={classes.divider} />
            <Typography variant='h6'>{data.prefLabel.prefLabel}</Typography>
            {this.renderTable()}
          </Paper>
        }
      </div>
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
