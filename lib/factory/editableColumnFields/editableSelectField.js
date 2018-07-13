import React, {Component} from 'react';
import Select from 'react-select';
import {sortBy, get} from "lodash";

class EditableSelectField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentValue: props.value,
        };

        this.onValueSave = this.onValueSave.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.editingRow = this.editingRow.bind(this);
    }

    onChangeValue(value) {
        this.setState({
            currentValue: value
        });
    }

    async onValueSave() {
        this.setState({
            isSaving: true
        });

        const response = await this.props.onUpdateField(this.props.rowId, this.props.column.value, this.state.currentValue)
        .then(() => {
            this.setState({
                isSaving: false,
                value: this.state.currentValue,
            });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row edited successfully', 'ok');
        })
        .catch(() => {
            this.setState({ isSaving: false, currentValue: this.props.value });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    onBlur() {
        this.onValueSave();
    }

    onClickEditRow() {
        this.props.onClickEditRow(this.props.rowId, this.props.column.name);
    }

    editingRow() {
        return this.props.rowUnderEdit &&
            this.props.rowUnderEditId == this.props.rowId &&
            this.props.columnUnderEditId == this.props.column.name;
    }

    render() {
        if (this.editingRow()) {
            const optionId = get(this.state.currentValue, 'value', null);
            const value = this.props.selectOptions.find(option => option.value == optionId);
            return (
                <td key={this.props.column.name}>
                    <Select value={value}
                            name={this.props.column.name}
                            style={{height: "100%"}}
                            options={sortBy(this.props.selectOptions, 'label')}
                            onChange={this.onChangeValue}
                            onBlur={this.onBlur}
                            autoFocus
                            backspaceRemoves={false}/>
                </td>
            );
        }
        const value = this.props.selectOptions.find(option => option.value == this.props.value);
        const label = get(value, 'label', value);
        return (
            <td key={this.props.column.name}
                onClick={this.onClickEditRow}>
                { label }
            </td>
        );
    }

}

EditableSelectField.defaultProps = {
    options: [],
};

export default EditableSelectField;
