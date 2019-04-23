import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import thumbImage from '../../img/thumb.png';

const styles = theme => ({
  root: {
    width: '100%',
    height: 'calc(100% - 150px)',
    overflow: 'auto'
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  // heroUnit: {
  //   backgroundColor: 'rgb(238, 238, 238)'
  // },
  heroContent: {
    maxWidth: 1100,
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  card: {
    //maxWidth: 340,
  },
  media: {
    height: 100,
    [ theme.breakpoints.down('md')]: {
      height: 60
    }
  },
  cardContent: {
    height: 85,
  }
});

let Main = props => {
  const { classes } = props;

  const ManuscriptsLink = props => <NavLink to="/manuscripts" {...props}/>;
  const WorksLink = props => <NavLink to="/works" {...props}/>;
  const PeopleLink = props => <NavLink to="/people" {...props}/>;
  const OrganizationsLink = props => <NavLink to="/organizations" {...props}/>;
  const PlacesLink = props => <NavLink to="/places" {...props}/>;

  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <div className={classes.heroContent}>
          <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
              Mapping Manuscript Migrations
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            MMM is a semantic portal for finding and studying pre-modern manuscripts and their movements,
            based on linked collections of  Schoenberg Institute, Bodleian Library, and IRHT.
            Select an application view below.
          </Typography>
        </div>
      </div>
      <div className={classNames(classes.layout, classes.cardGrid)}>
        <Grid container spacing={40}>

          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea component={ManuscriptsLink}>
                <CardMedia
                  className={classes.media}
                  image={thumbImage}
                  title="Manuscripts"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Manuscripts
                  </Typography>
                  <Typography component="p">
                    Physical manuscript objects.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea component={WorksLink}>
                <CardMedia
                  className={classes.media}
                  image={thumbImage}
                  title="Works"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Works
                  </Typography>
                  <Typography component="p">
                    Intellectual content carried out by manuscripts.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea disabled>
                <CardMedia
                  className={classes.media}
                  image={thumbImage}
                  title="Events"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Events
                  </Typography>
                  <Typography component="p">
                    Events related to manuscripts.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea component={PeopleLink}>
                <CardMedia
                  className={classes.media}
                  image={thumbImage}
                  title="People"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    People
                  </Typography>
                  <Typography component="p">
                    People related to manuscripts and works.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea component={OrganizationsLink}>
                <CardMedia
                  className={classes.media}
                  image={thumbImage}
                  title="Organizations"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Organizations
                  </Typography>
                  <Typography component="p">
                    Organizations related to manuscripts.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea component={PlacesLink}>
                <CardMedia
                  className={classes.media}
                  image={thumbImage}
                  title="Places"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Places
                  </Typography>
                  <Typography component="p">
                    Places related to manuscripts and works.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
