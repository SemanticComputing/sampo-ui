import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ManuscriptsPageTable from '../perspectives/ManuscriptsPageTable';
import ExpressionsPageTable from '../perspectives/ExpressionsPageTable';
import CollectionsPageTable from '../perspectives/CollectionsPageTable';
import WorksPageTable from '../perspectives/WorksPageTable';
import EventsPageTable from '../perspectives/EventsPageTable';
import ActorsPageTable from '../perspectives/ActorsPageTable';
import PlacesPageTable from '../perspectives/PlacesPageTable';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    padding: theme.spacing(1),
    width: 800,
    overflowY: 'auto'
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  sahaButton: {
    marginTop: theme.spacing(2),
  }
});

class InstanceHomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      instanceHeading: '',
      sources: []
    };
  }

  handleAddSource = source => {
    let updatedSources = this.state.sources;
    updatedSources.push(source);
    this.setState({
      sources: updatedSources
    });
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
        break;
      case 'expressions':
        this.setState({
          instanceHeading: 'Expression',
        });
        uri = `${base}/expression/${localID}`;
        break;
      case 'collections':
        this.setState({
          instanceHeading: 'Collection',
        });
        uri = `${base}/collection/${localID}`;
        break;
      case 'works':
        this.setState({
          instanceHeading: 'Work',
        });
        uri = `${base}/work/${localID}`;
        break;
      case 'events':
        this.setState({
          instanceHeading: 'Event',
        });
        uri = `${base}/event/${localID}`;
        break;
      case 'actors':
        this.setState({
          instanceHeading: 'Actor',
        });
        uri = `${base}/actor/${localID}`;
        break;
      case 'places':
        this.setState({
          instanceHeading: 'Place',
        });
        uri = `${base}/place/${localID}`;
        break;
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
          tableEl =
            <ManuscriptsPageTable
              data={this.props.data}
              addSource={this.handleAddSource}
            />;
          break;
        case 'Expression':
          tableEl = <ExpressionsPageTable data={this.props.data} />;
          break;
        case 'Collection':
          tableEl = <CollectionsPageTable data={this.props.data} />;
          break;
        case 'Work':
          tableEl = <WorksPageTable data={this.props.data} />;
          break;
        case 'Event':
          tableEl = <EventsPageTable data={this.props.data} />;
          break;
        case 'Actor':
          tableEl = <ActorsPageTable data={this.props.data} />;
          break;
        case 'Place':
          tableEl = <PlacesPageTable data={this.props.data} />;
          break;
        default:
          tableEl = <div></div>;
      }
    }
    return tableEl;
  }

  render = () => {
    const { classes, data } = this.props;
    console.log(this.state.sources)
    return(
      <div className={classes.root}>
        {data !== null &&
          <Paper className={classes.content}>
            <Typography variant='h4'>{this.state.instanceHeading}</Typography>
            <Divider className={classes.divider} />
            <Typography variant='h6'>{data.prefLabel.prefLabel}</Typography>
            {this.renderTable()}
            <Button
              className={classes.sahaButton}
              variant='contained'
              target='_blank'
              rel='noopener noreferrer'
              href={data.id}
            >
              Open in Linked Data Browser
            </Button>
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
  data: PropTypes.object,
  routeProps: PropTypes.object.isRequired
};

export default withStyles(styles)(InstanceHomePage);
