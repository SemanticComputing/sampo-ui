import React from 'react'
import Paper from '@material-ui/core/Paper'

const styles = {
   padding: 8
}
const PaperContainer = ({ children }) => <Paper style={styles}>{children}</Paper>

export default PaperContainer