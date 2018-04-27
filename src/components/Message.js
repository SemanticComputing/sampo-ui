import React from 'react';
import { toastr } from 'react-redux-toastr';

class Message extends React.Component {

  componentDidUpdate() {
    if (this.props.error.hasError) {
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

export default Message;
