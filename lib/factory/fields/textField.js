import React, {Component} from "react";

class TextField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        }

        this.onTextChange = this.onTextChange.bind(this);
    }

    onTextChange(event) {
        this.setState({
            value: event.target.value
        })
        this.props.onChange(this.props.filterableProperty, event);
    }

    render() {
        return (
            <input
                type="text"
                style={{ height: "100%" }}
                name={this.props.name}
                onChange={this.onTextChange}
                value={this.state.value}
                className="n-inputfield form-control"
            />
        )
    }
}

export default TextField;
