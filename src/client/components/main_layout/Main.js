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
import { Link } from 'react-router-dom';
import { has } from 'lodash';
import thumbImage from '../../img/thumb.png';

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(1),
    [ theme.breakpoints.up('md')]: {
      height: 'calc(100% - 150px)',
      overflow: 'auto',
    },
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  link: {
    textDecoration: 'none'
  },
  heroContent: {
    maxWidth: 1100,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1)
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(1100 + theme.spacing(6))]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
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
        <Grid container spacing={5}>
          {props.perspectives.map(perspective => {
            return (
              <Grid key={perspective.id} item xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  {has(perspective, 'externalUrl') &&
                    <a className={classes.link}
                      href={perspective.externalUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={thumbImage}
                          title={perspective.label}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {perspective.label}
                          </Typography>
                          <Typography component="p">
                            {perspective.desc}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  }
                  {!has(perspective, 'externalUrl') &&
                    <CardActionArea component={Link} to={`/${perspective.id}/faceted-search`}>
                      <CardMedia
                        className={classes.media}
                        image={thumbImage}
                        title={perspective.label}
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {perspective.label}
                        </Typography>
                        <Typography component="p">
                          {perspective.desc}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  }
                </Card>
              </Grid>
            );
          }

          )}
        </Grid>
      </div>
    </div>
  );
};

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  perspectives: PropTypes.array.isRequired
};

export default withStyles(styles)(Main);
