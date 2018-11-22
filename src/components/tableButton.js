import React, { Component } from 'react';

class TableButton extends Component {
  render() {
        return (
            <li className="list-inline-item" key={this.props.key}>
                <span className={this.props.className} onClick={this.props.onClick} />
            </li>
        );
    }
}

export default TableButton;
