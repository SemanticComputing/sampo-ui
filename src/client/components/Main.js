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

const styles = theme => ({
  root: {
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: 'rgb(238, 238, 238)'
  },
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
    maxWidth: 340,
  },
  media: {
    height: 100,
  },
});

let Main = props => {
  const { classes } = props;

  const ManuscriptLink = props => <NavLink to="/manuscripts" {...props}/>;

  return (
    <div className={classes.root}>
      {/* Hero unit */}
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
        {/* End hero unit */}
        <Grid container spacing={40}>

          <Grid item sm={6} md={4} lg={4}>
            <Card className={classes.card}>
              <CardActionArea component={ManuscriptLink}>
                <CardMedia
                  className={classes.media}
                  image="img/thumb.png"
                  title="Manuscripts"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Manuscripts
                  </Typography>
                  <Typography component="p">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item sm={6} md={4} lg={4}>
            <Card className={classes.card}>
              <CardActionArea disabled>
                <CardMedia
                  className={classes.media}
                  image="img/thumb.png"
                  title="Manuscripts"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Observations
                  </Typography>
                  <Typography component="p">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item sm={6} md={4} lg={4}>
            <Card className={classes.card}>
              <CardActionArea disabled>
                <CardMedia
                  className={classes.media}
                  image="img/thumb.png"
                  title="Manuscripts"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Persons
                  </Typography>
                  <Typography component="p">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item sm={6} md={4} lg={4}>
            <Card className={classes.card}>
              <CardActionArea disabled>
                <CardMedia
                  className={classes.media}
                  image="img/thumb.png"
                  title="Manuscripts"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Organizations
                  </Typography>
                  <Typography component="p">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item sm={6} md={4} lg={4}>
            <Card className={classes.card}>
              <CardActionArea disabled>
                <CardMedia
                  className={classes.media}
                  image="img/thumb.png"
                  title="Manuscripts"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Places
                  </Typography>
                  <Typography component="p">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
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
