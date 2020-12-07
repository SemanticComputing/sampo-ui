import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import ResultTableCell from '../facet_results/ResultTableCell'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/InfoOutlined'

const styles = theme => ({
  instanceTable: {
    // maxWidth: 1000,
    // width: '100%',
    // height: '100%',
    borderTop: '1px solid rgba(224, 224, 224, 1);'
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  sahaButton: {
    margin: theme.spacing(2)
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelCell: {
    width: 240
  },
  tooltip: {
    marginTop: -3
  },
  expandCell: {
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: 32
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

/**
 * A component for generating a table based on data about an entity.
 */
class InstanceHomePageTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expandedRows: new Set()
    }
  }

  componentDidMount = () => {
    if (this.props.fetchResultsWhenMounted) {
      this.props.fetchResults({
        resultClass: this.props.resultClassVariant,
        facetClass: this.props.facetClass,
        uri: this.props.uri
      })
    }
  }

  handleExpandRow = rowId => () => {
    const expandedRows = this.state.expandedRows
    if (expandedRows.has(rowId)) {
      expandedRows.delete(rowId)
    } else {
      expandedRows.add(rowId)
    }
    this.setState({ expandedRows })
  }

  hasExpandableContent = ({ data, config }) => {
    let hasExpandableContent = false
    const isArray = Array.isArray(data)
    if (isArray) {
      hasExpandableContent = true
    }
    if (!isArray &&
        data !== '-' &&
        config.valueType === 'string' &&
        config.collapsedMaxWords &&
        data.split(' ').length > config.collapsedMaxWords
    ) {
      hasExpandableContent = true
    }
    return hasExpandableContent
  }

  render = () => {
    const { classes, data, resultClass, properties } = this.props
    return (
      <>
        {data &&
          <Table className={classes.instanceTable} size='small'>
            <TableBody>
              {properties.map(row => {
                const label = intl.get(`perspectives.${resultClass}.properties.${row.id}.label`)
                const description = intl.get(`perspectives.${resultClass}.properties.${row.id}.description`)
                const {
                  id, valueType, makeLink, externalLink, sortValues, sortBy, numberedList, previewImageHeight,
                  linkAsButton, collapsedMaxWords, showSource, sourceExternalLink, renderAsHTML, HTMLParserTask
                } = row
                const expanded = this.state.expandedRows.has(row.id)
                return (
                  <TableRow key={row.id}>
                    <TableCell className={classes.labelCell}>
                      {label}
                      <Tooltip
                        className={classes.tooltip}
                        title={description}
                        enterDelay={300}
                      >
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell className={classes.expandCell}>
                      {this.hasExpandableContent({ data: data[id], config: row }) &&
                        <IconButton
                          className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded
                          })}
                          onClick={this.handleExpandRow(row.id)}
                          aria-expanded={expanded}
                          aria-label='Show more'
                        >
                          <ExpandMoreIcon />
                        </IconButton>}
                    </TableCell>
                    <ResultTableCell
                      columnId={id}
                      data={data[id]}
                      valueType={valueType}
                      makeLink={makeLink}
                      externalLink={externalLink}
                      sortValues={sortValues}
                      sortBy={sortBy}
                      numberedList={numberedList}
                      container='cell'
                      expanded={expanded}
                      previewImageHeight={previewImageHeight}
                      linkAsButton={linkAsButton}
                      collapsedMaxWords={collapsedMaxWords}
                      showSource={showSource}
                      sourceExternalLink={sourceExternalLink}
                      renderAsHTML={renderAsHTML}
                      HTMLParserTask={HTMLParserTask}
                      referencedTerm={data.referencedTerm}
                    />
                  </TableRow>
                )
              }
              )}
            </TableBody>
          </Table>}
      </>
    )
  }
}

InstanceHomePageTable.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  data: PropTypes.object,
  properties: PropTypes.array.isRequired
}

export const InstanceHomePageTableComponent = InstanceHomePageTable

export default withStyles(styles)(InstanceHomePageTable)
