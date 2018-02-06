import React, {Component} from "react";
import Select from 'react-select';
import {sortBy} from 'lodash';

class SelectField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: null,
            options: null
        }

        this.onSelectChange = this.onSelectChange.bind(this);
        this.transformOptions = this.transformOptions.bind(this);
    }

    componentDidMount() {
        this.transformOptions();
    }

    onSelectChange(value) {
        this.setState({
            value
        })
        this.props.onChange(this.props.name, this.props.filterableProperty, value);
    }

    render() {
        return (
            <Select
                value={this.state.value}
                multi
                name={this.props.name}
                style={{ height: "100%" }}
                options={sortBy(this.state.options, 'name')}
                onChange={this.onSelectChange}
                backspaceRemoves={false}
            />
        )
    }

    transformOptions() {
        let options = [];

        if (this.props.options) {
            this.props.options.map(option => {
                let opt = {
                    value: option.id,
                    label: option.name
                }
                options.push(opt);
            });
        }

        this.setState({
            options
        });
    }
}

export default SelectField;