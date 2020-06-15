import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button'
import { yasguiBaseUrl, yasguiParams } from '../../configs/sampo/GeneralConfig'
import querystring from 'querystring'
import intl from 'react-intl-universal'

const styles = theme => ({
  root: {
    height: 'calc(100% - 72px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
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
    if (this.props.data.page === -1) {
      this.props.updatePage(this.props.resultClass, 0)
    }
    if (this.props.pageType === 'facetResults') {
      this.props.fetchPaginatedResults(
        this.props.resultClass,
        this.props.facetClass,
        this.props.data.sortBy
      )
    }
  }

  render = () => {
    const { classes, data } = this.props
    let yasguiUrl = ''
    if (data.paginatedResultsSparqlQuery !== null) {
      yasguiUrl = `${yasguiBaseUrl}/#query=${encodeURIComponent(data.paginatedResultsSparqlQuery)}&${querystring.stringify(yasguiParams)}`
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
  data: PropTypes.object.isRequired,
  pageType: PropTypes.string.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  sparqlQuery: PropTypes.string,
  id: PropTypes.string
}

export default withStyles(styles)(Export)
