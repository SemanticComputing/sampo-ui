import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { withStyles } from '@material-ui/core/styles'
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
  }
})

/**
 * A component for generating a table based on data about an entity.
 */
class InstanceHomePageTable extends React.Component {
  componentDidMount = () => {
    if (this.props.fetchResultsWhenMounted) {
      this.props.fetchResults({
        resultClass: this.props.resultClassVariant,
        facetClass: this.props.facetClass,
        uri: this.props.uri
      })
    }
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
                      expanded
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
