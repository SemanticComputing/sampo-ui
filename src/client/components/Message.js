import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

class Message extends React.Component {

  componentDidUpdate = prevProps => {
    if (this.props.error.id != prevProps.error.id) {
      const { title, text } = this.props.error.message;
      toastr.error(title, text);
    }
  }

  render() {
    return(
      <div></div>
    );
  }
}

Message.propTypes = {
  error: PropTypes.object.isRequired,
};

export default Message;
