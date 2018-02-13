import React, {Component} from 'react';
import Select from 'react-select';
import {sortBy} from "lodash";

class EditableSelectField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            options: null
        };

        this.onChangeValue = this.onChangeValue.bind(this);
        this.transformOptions = this.transformOptions.bind(this);
    }

    componentDidMount() {
        this.transformOptions();
    }

    onChangeValue(value) {
        console.log('onChange: ', this.props.rowId, value);

        this.setState({
            value
        });
        this.props.onUpdateField(this.props.rowId, this.props.column.value, value).then(response => {
            console.log("response: ", response);
        }).catch(error => {
            console.log("error: ", error);
        });
    }

    transformOptions() {
        let options = [];

        if (this.props.selectOptions) {
            this.props.selectOptions.map(option => {
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

    render() {
        if (!this.props.rowUnderEdit || this.props.rowUnderEditId != this.props.rowId || this.props.columnUnderEditId != this.props.column.name) {
            let value;
            if(this.state.value.label) {
                value = this.state.value.label;
            } else {
                value = this.state.value;
            }
            return (
                <td key={this.props.column.name}
                    onClick={() => this.props.onClickEditRow(this.props.rowId, this.props.column.name)}>
                    { value }
                </td>
            );
        } else if (this.props.rowUnderEdit && this.props.rowUnderEditId == this.props.rowId && this.props.columnUnderEditId == this.props.column.name) {
            console.log("value: ", this.state.value);
            return (
                <td key={this.props.column.name}>
                    <Select value={this.state.value}
                            name={this.props.column.name}
                            style={{height: "100%"}}
                            options={sortBy(this.state.options, 'name')}
                            onChange={this.onChangeValue}
                            backspaceRemoves={false}/>
                </td>
            );
        }
    }

}

export default EditableSelectField;