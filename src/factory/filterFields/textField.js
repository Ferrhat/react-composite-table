import React, {Component} from "react";

class TextField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        }

        this.onTextChange = this.onTextChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    }

    onTextChange(event) {
        const value = event.target.value;
        this.setState({
            value,
        })
        this.props.onChange(this.props.name, 'text', this.props.filterableProperty, value);
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
