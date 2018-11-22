import React, {Component} from "react";
import Select from 'react-select';
import {sortBy} from 'lodash';

class SelectField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: null,
        }

        this.onSelectChange = this.onSelectChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    }

    onSelectChange(value) {
        this.setState({
            value
        })
        this.props.onChange(this.props.name, 'multiSelect', this.props.filterableProperty, value);
    }

    render() {
        return (
            <Select
                value={this.state.value}
                multi
                name={this.props.name}
                style={{ height: "100%" }}
                options={sortBy(this.props.options, 'value')}
                onChange={this.onSelectChange}
                backspaceRemoves={false}
            />
        )
    }
}

SelectField.defaultProps = {
    options: [],
};

export default SelectField;
