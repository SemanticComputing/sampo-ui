import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button'
import { yasguiBaseUrl, yasguiParams } from '../../configs/sampo/GeneralConfig'
import querystring from 'querystring'
import intl from 'react-intl-universal'

const styles = theme => ({
  root: props => ({
    minHeight: 400,
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${props.layoutConfig.tabHeight}px)`
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  link: {
    textDecoration: 'none'
  },
  button: {
    margin: theme.spacing(3)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
})

class Export extends React.Component {
  componentDidMount = () => {
    if (this.props.pageType === 'facetResults') {
      if (this.props.data.page === -1) {
        this.props.updatePage(this.props.resultClass, 0)
      }
      this.props.fetchPaginatedResults(
        this.props.resultClass,
        this.props.facetClass,
        this.props.data.sortBy
      )
    }
  }

  render = () => {
    const { classes, data, pageType } = this.props
    let yasguiUrl = ''
    const sparqlQuery = pageType === 'facetResults' ? data.paginatedResultsSparqlQuery : this.props.sparqlQuery
    if (sparqlQuery !== null) {
      yasguiUrl = `${yasguiBaseUrl}/#query=${encodeURIComponent(sparqlQuery)}&${querystring.stringify(yasguiParams)}`
    }
    return (
      <div className={classes.root}>
        <a
          className={classes.link}
          href={yasguiUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button variant='contained' color='primary' className={classes.button}>
            {intl.get('exportToYasgui')}
          </Button>
        </a>
        {this.props.pageType === 'instancePage' &&
          <a
            className={classes.link}
            href={this.props.id}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button variant='contained' color='primary' className={classes.button}>
              {intl.get('openInLinkedDataBrowser')}
            </Button>
          </a>}
      </div>
    )
  }
}

Export.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
  pageType: PropTypes.string.isRequired,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  fetchPaginatedResults: PropTypes.func,
  updatePage: PropTypes.func,
  sparqlQuery: PropTypes.string,
  id: PropTypes.string
}

export default withStyles(styles)(Export)
