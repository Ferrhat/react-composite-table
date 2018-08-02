import React, { Component } from 'react';

export class CustomButtons extends Component {
  render() {
        const {buttons, row} = this.props;

        return (
            <React.Fragment>
                {buttons.map((button, i) => {
                    let innerButton;

                    if (button.renderer) {
                        innerButton = button.renderer(row.id);
                    } else {
                        const { type: iconType, name: iconName } = button.icon;
                        innerButton = <span className={`${iconType} ${iconType}-${iconName}`} onClick={() => button.handler(row.id)} > {button.title} </span>;
                    }

                    return (
                        <li className="list-inline-item" key={`${row.id}-${i}`}>
                            {innerButton}
                        </li>
                    );
                })}
            </React.Fragment>
        );
    }
}

export default CustomButtons;
