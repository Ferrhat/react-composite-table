import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

class Message extends Component {
  icon() {
    switch (this.props.level) {
      case 'error':
        return <span className="icon icon-error" />;
      case 'info':
        return <span className="icon icon-info" />;
      case 'ok':
        return <span className="icon icon-ok" />;
      case 'warning':
        return <span className="icon icon-warning" />;
      default:
        return null;
    }
  }
  render() {
    return (
      <Alert onClick={this.props.onClick}>
        {this.icon()}
        {this.props.content}
      </Alert>
    );
  }
}
Message.propTypes = {
  level: PropTypes.string,
  content: PropTypes.string,
};

export default Message;
