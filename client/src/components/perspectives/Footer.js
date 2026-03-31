import React from 'react'
import Paper from '@mui/material/Paper'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import aaltoLogo from '../../img/logos/Aalto_SCI_EN_13_BLACK_2_cropped.png'
import hyLogo from '../../img/logos/university-of-helsinki-logo-transparent-black.png'
import { useConfigsStore } from '../../stores/configsStore'

/**
 * A component for creating a footer. The logos are imported inside this component.
 */
const Footer = props => {
  const { getConfigImgFile } = useConfigsStore()
  return (
    <Paper
      sx={theme => ({
        boxShadow: '0 -20px 20px -20px #333',
        borderRadius: 0,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap',
        rowGap: theme.spacing(2),
        columnGap: theme.spacing(3),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.down(496)]: {
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2)
        },
        minHeight: {
          xs: props.layoutConfig.footer.reducedHeight,
          hundredPercentHeight: props.layoutConfig.footer.reducedHeight,
          reducedHeight: props.layoutConfig.footer.defaultHeight
        }
      })}
    >
      {props.layoutConfig.footer.images && props.layoutConfig.footer.images.map(image => {
        return (
          <Box
            key={image.id}
            component='a'
            href={image.href}
            target='_blank'
            rel='noopener noreferrer'
            sx={theme => ({
              width: image.width,
              height: image.height,
              [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
                width: image.width * 1.125,
                height: image.height * 1.125
              }
            })}
          >
            <Box
              component='img'
              src={image.image}
              alt={image.alt}
              sx={{
                height: '100%'
              }}
            />
          </Box>
        )
      })}
    </Paper>
  )
}

Footer.propTypes = {
  layoutConfig: PropTypes.object.isRequired
}

export default Footer
