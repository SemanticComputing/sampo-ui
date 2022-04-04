import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import withStyles from '@mui/styles/withStyles'
import clsx from 'clsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import ResultTableCell from '../facet_results/ResultTableCell'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/InfoOutlined'

const styles = theme => ({
  instanceTable: {
    maxWidth: 1200,
    width: '100%',
    [theme.breakpoints.down('lg')]: {
      tableLayout: 'fixed',
      overflowWrap: 'break-word'
    },
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
    [theme.breakpoints.down('lg')]: {
      paddingRight: 0
    },
    [theme.breakpoints.up('md')]: {
      minWidth: 280
    }
  },
  tooltip: {
    marginTop: -3
  },
  expandCell: {
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: 32,
    [theme.breakpoints.down('lg')]: {
      paddingLeft: 0
    }
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
class InstancePageTable extends React.Component {
  constructor (props) {
    super(props)
    const expandedRows = new Set()
    props.properties.forEach(prop => {
      if (prop.expandedOnInstancePage) {
        expandedRows.add(prop.id)
      }
    })
    this.state = { expandedRows }
  }

  componentDidMount = () => {
    if (this.props.fetchResultsWhenMounted) {
      this.props.fetchResults({
        perspectiveID: this.props.perspectiveConfig.id,
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        uri: this.props.uri
      })
    }
  }

  handleExpandRow = rowId => event => this.updateExpanedRows(rowId)

  handleExpandRowFromChildComponent = rowId => this.updateExpanedRows(rowId)

  updateExpanedRows = rowId => {
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
        data &&
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
    const { classes, data, properties, screenSize, perspectiveConfig } = this.props
    const perspectiveID = perspectiveConfig.id
    return (
      <>
        {data &&
          <Table className={classes.instanceTable} size='small'>
            <TableBody>
              {properties.map(row => {
                const label = intl.get(`perspectives.${perspectiveID}.properties.${row.id}.label`)
                const description = intl.get(`perspectives.${perspectiveID}.properties.${row.id}.description`)
                const {
                  id, valueType, makeLink, externalLink, sortValues, sortBy, sortByConvertDataTypeTo, numberedList, minWidth,
                  linkAsButton, collapsedMaxWords, showSource, sourceExternalLink, renderAsHTML, HTMLParserTask
                } = row
                let { previewImageHeight } = row
                if (screenSize === 'xs' || screenSize === 'sm') {
                  previewImageHeight = 50
                }
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
                        <IconButton size='large'>
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
                          size='large'
                        >
                          <ExpandMoreIcon />
                        </IconButton>}
                    </TableCell>
                    <ResultTableCell
                      key={id}
                      rowId={row.id}
                      columnId={id}
                      data={data[id]}
                      valueType={valueType}
                      makeLink={makeLink}
                      externalLink={externalLink}
                      sortValues={sortValues}
                      sortBy={sortBy}
                      sortByConvertDataTypeTo={sortByConvertDataTypeTo}
                      numberedList={numberedList}
                      minWidth={minWidth}
                      previewImageHeight={previewImageHeight}
                      container='cell'
                      expanded={expanded}
                      onExpandClick={this.handleExpandRowFromChildComponent}
                      shortenLabel={false}
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

InstancePageTable.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  data: PropTypes.object,
  properties: PropTypes.array.isRequired
}

export const InstanceHomePageTableComponent = InstancePageTable

export default withStyles(styles)(InstancePageTable)
