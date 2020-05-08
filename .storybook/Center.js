import React from 'react'

const styles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}
const Center = ({ children }) => <div style={styles}>{children}</div>

export default Center