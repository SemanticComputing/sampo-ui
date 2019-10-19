import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//import Divider from '@material-ui/core/Divider';
import intl from 'react-intl-universal';

const styles = theme => ({
  root: {
    position: 'absolute',
    //marginTop: 64,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      marginTop: 56,
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
    },
  },
  panel: {
    width: '100%'
  },
  summary: {
    paddingLeft: theme.spacing(1),
  },
  summaryContent: {
    display: 'block',
    marginBottom: `${theme.spacing(1)}px !important`
  },
  label: {
    marginTop: theme.spacing(1),
    height: 32,
    overflow: 'auto'
  },
  content: {
    paddingTop: 0,
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflow: 'auto',
    display: 'block'
  }
});

const InfoHeader = props => {

  const handleExpandButtonOnClick = () => {
    props.updateExpanded({
      resultClass: props.resultClass,
      pageType: props.pageType
    });
  };

  const generateLabel = () => {
    let label = '';
    const data = props.instanceData;
    const hasData = data !== null && Object.values(data).length >= 1;
    if (hasData) { label = data.prefLabel.prefLabel; }
    return label;
  };

  return(
    <Grid container spacing={1} className={props.classes.root}>
      <ExpansionPanel
        className={props.classes.panel}
        expanded={props.expanded}>
        <ExpansionPanelSummary
          className={props.classes.summary}
          classes={{
            content: props.classes.summaryContent
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          IconButtonProps={{ onClick: handleExpandButtonOnClick }}
        >
          <Typography component="h1" variant="h3">
            {props.pageType === 'facetResults' && intl.getHTML(`perspectives.${props.resultClass}.label`)}
            {props.pageType === 'instancePage' && intl.getHTML(`perspectives.${props.resultClass}.instancePage.label`)}
          </Typography>
          {props.pageType === 'instancePage' &&
            <React.Fragment>
              <Typography className={props.classes.label} component="h1" variant="h6">{generateLabel()}</Typography>
            </React.Fragment>
          }
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          className={props.classes.content}
          style={{ height: props.descriptionHeight }}
        >
          {props.pageType === 'facetResults' && intl.getHTML(`perspectives.${props.resultClass}.longDescription`)}
          {props.pageType === 'instancePage' && intl.getHTML(`perspectives.${props.resultClass}.instancePage.description`)}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  );
};

InfoHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  instanceData: PropTypes.object,
  pageType: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  updateExpanded: PropTypes.func.isRequired,
  descriptionHeight: PropTypes.number.isRequired,
};

export default withStyles(styles)(InfoHeader);
