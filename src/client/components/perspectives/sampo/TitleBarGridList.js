import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
}))

const data = [
  {
    img: 'http://luettelointi.nba.fi/assets/uploads/find_images/2019_02_11_1004_fix.JPG',
    title: 'Keihäänkärki',
    reason: 'similar material'
  },
  {
    img: 'http://luettelointi.nba.fi/assets/uploads/find_images/2019_02_11_0992_fix.JPG',
    title: 'Kirveen terä',
    reason: 'similar dating'
  },
  {
    img: 'http://luettelointi.nba.fi/assets/uploads/find_images/2019_02_11_0969.JPG',
    title: 'Sahan terä',
    reason: 'similar object type'
  },
  {
    img: 'http://luettelointi.nba.fi/assets/uploads/find_images/40039-131.JPG',
    title: 'Neulahakasia',
    reason: 'similar dating'
  }
]

export default function TitlebarGridList () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <GridList cellHeight={200} className={classes.gridList} cols={2}>
        {data.map((tile) => (
          <GridListTile key={tile.img}>
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span>{tile.reason}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}
