import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  layout: {
    width: 'auto',
    padding: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      marginLeft: 0,
      marginRight: 0,
    },
    [theme.breakpoints.up(1100 + theme.spacing(6))]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    overflow: 'auto'
  },
});

const AboutPage = props => {
  const { classes } = props;
  return(
    <div className={classes.root}>
      <Paper className={classes.layout}>
        <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
            About the project
        </Typography>
        <Typography paragraph={true}>
          Mapping Manuscript Migrations (MMM) has been developed with funding from the Trans-Atlantic
          Platform under its Digging into Data Challenge (2017-2019). The partners in this project are
          the University of Oxford, the University of Pennsylvania, Aalto University,
          and the Institut de recherche et d’histoire des textes.
          Funding has been provided by the UK Economic and Social Research Council,
          the Institute of Museum and Library Services, the Academy of Finland, and the
          Agence nationale de la recherche.
        </Typography>
        <Typography paragraph={true}>
          MMM is intended to enable large-scale exploration of data relating to the history and provenance
          of (primarily) Western European medieval and early modern manuscripts.
        </Typography>
        <Typography component="h1" variant="h4" color="textPrimary" gutterBottom>
            Data
        </Typography>
        <Typography paragraph={true}>
          MMM combines data from three specialist databases:
          <ul>
            <li><a href="https://sdbm.library.upenn.edu/" target='_blank' rel='noopener noreferrer'>
              Schoenberg Database of Manuscripts
            </a></li>
            <li><a href="http://bibale.irht.cnrs.fr/" target='_blank' rel='noopener noreferrer'>
              Bibale
            </a></li>
            <li><a href="https://medieval.bodleian.ox.ac.uk/" target='_blank' rel='noopener noreferrer'>
              Medieval Manuscripts in Oxford Libraries
            </a></li>
          </ul>
        </Typography>
        <Typography paragraph={true}>
          The data have been combined using a unified Data Model based on the CIDOC-CRM and FRBRoo
          ontologies. A diagram of the Data Model can be seen <a href="https://drive.google.com/open?id=1uyTA8Prwtts5g13eor48tKHk_g63NaaG" target='_blank' rel='noopener noreferrer'>
          here</a>. The data have not been corrected or amended in any way. If you notice an error in the data,
          please report it to the custodians of the original database.
        </Typography>
        <Typography component="h1" variant="h4" color="textPrimary" gutterBottom>
            Features
        </Typography>
        <Typography paragraph={true}>
          The MMM interface enables you to browse and search through most of the data assembled by the project
          from the three source databases. If you want to inspect the full raw data for any individual
          manuscript or other entity, please click on the “Open in Linked Data browser” button on
          the “Export” tab of the landing-page for that entity.
        </Typography>
        <Typography paragraph={true}>
          The MMM interface also provides map-based visualizations for a selection of the data relating to
          Manuscripts, Actors, and Places. The data resulting from a search or a filtered browse can be
          exported in the form of a CSV file. Click on the “Export” option and then on the button
          “Open result table SPARQL query in yasgui.org”.
        </Typography>
        <Typography paragraph={true}>
          If you want to search all the underlying data using the SPARQL query language, the endpoint is
          available here: <a href="http://ldf.fi/mmm-cidoc/sparql" target='_blank' rel='noopener noreferrer'>
          http://ldf.fi/mmm-cidoc/sparql</a>.
        </Typography>
        <Typography component="h1" variant="h4" color="textPrimary" gutterBottom>
            Data Reuse
        </Typography>
        <Typography paragraph={true}>
          The MMM data are made available for reuse under a <a href="https://creativecommons.org/licenses/by-nc/4.0/"
            target='_blank' rel='noopener noreferrer'>
          CC-BY-NC 4.0 licence</a>.
        </Typography>
        <Typography paragraph={true}>
          You must give appropriate credit, provide a link to the license, and indicate if changes
          were made. You may do so in any reasonable manner, but not in any way that suggests the
          MMM project or its partner institutions endorses you or your use.
        </Typography>
        <Typography paragraph={true}>
          You may not use the data for commercial purposes.
        </Typography>
        <Typography component="h1" variant="h4" color="textPrimary" gutterBottom>
            More Information
        </Typography>
        <Typography paragraph={true}>
          The MMM project has its own  <a href="https://github.com/mapping-manuscript-migrations"
            target='_blank' rel='noopener noreferrer'>
          GitHub site</a>.
        </Typography>
        <Typography paragraph={true}>
          Here you will find documentation, scripts and programs, and samples of the raw data.
        </Typography>
      </Paper>
    </div>
  );
};


AboutPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AboutPage);
