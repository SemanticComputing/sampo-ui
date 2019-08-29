import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    position: 'absolute',
    marginTop: 64,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    backgroundColor: '#bdbdbd',
  },
  panel: {
    width: '100%'
  },
  summary: {
    paddingLeft: theme.spacing(1)
  },
  content: {
    paddingTop: 0,
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflow: 'auto',
  }
});

const PerspectiveHeader = props => {

  const handleExpandButtonOnClick = () => {
    props.updateExpanded(props.resultClass);
  };

  return(
    <Grid container spacing={1} className={props.classes.root}>
      <ExpansionPanel
        className={props.classes.panel}
        expanded={props.expanded}>
        <ExpansionPanelSummary
          className={props.classes.summary}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          IconButtonProps={{ onClick: handleExpandButtonOnClick }}
        >
          <Typography component="h1" variant="h3">{props.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          className={props.classes.content}
          style={{ height: props.descriptionHeight }}
        >
          <Typography>{props.description}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  );
};

PerspectiveHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  updateExpanded: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  descriptionHeight: PropTypes.number.isRequired,
};

export default withStyles(styles)(PerspectiveHeader);
