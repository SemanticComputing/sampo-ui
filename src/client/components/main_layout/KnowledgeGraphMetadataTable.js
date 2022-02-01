import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: theme.spacing(3)
  },
  tableContainer: {
    maxWidth: 550
  }
}))

const KnowledgeGraphMetadataTable = props => {
  const classes = useStyles()

  useEffect(() => {
    if (props.fetchKnowledgeGraphMetadata) {
      const { perspectiveID, resultClass } = props
      props.fetchKnowledgeGraphMetadata({
        perspectiveID,
        resultClass
      })
    }
  }, [])

  const data = props.knowledgeGraphMetadata ? props.knowledgeGraphMetadata.databaseDump : []

  return (
    <div className={classes.root}>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Database</TableCell>
              <TableCell>Data dump date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell component='th' scope='row'>
                  <a
                    target='_blank' rel='noopener noreferrer'
                    href={row.dataProviderUrl}
                  >
                    {row.prefLabel}
                  </a>
                </TableCell>
                <TableCell>{row.modified}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

KnowledgeGraphMetadataTable.propTypes = {
  fetchKnowledgeGraphMetadata: PropTypes.func,
  knowledgeGraphMetadata: PropTypes.object,
  resultClass: PropTypes.string
}

export default KnowledgeGraphMetadataTable
