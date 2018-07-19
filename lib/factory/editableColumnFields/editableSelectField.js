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
        this.onRowValueSave = this.onRowValueSave.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }

    onChangeValue(value) {
        this.props.onChangeEditRow(get(value, 'value', value));
        this.setState({
            currentValue: value
        });
    }

    async onRowValueSave() {
        this.setState({
            isSaving: true
        });
        this.props.onUpdateRow()
        .then(() => {
            this.setState({ isSaving: false, value: this.state.currentValue });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row edited successfully', 'ok');
        })
        .catch(() => {
            this.setState({ isSaving: false, currentValue: this.props.value });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    async onValueSave() {
        this.setState({
            isSaving: true
        });

        this.props.onUpdateField(this.props.rowId, this.props.column.value, this.state.currentValue)
        .then(() => {
            this.setState({ isSaving: false, value: this.state.currentValue });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row edited successfully', 'ok');
        })
        .catch(() => {
            this.setState({ isSaving: false, currentValue: this.props.value });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    closeEdit(event) {
        if (event.key == 'Enter') {
            if (this.props.onUpdateRow) {
                this.onRowValueSave();
            } else {
                this.onValueSave();
            }
        }
    }

    onBlur() {
        if (!this.props.onUpdateRow) {
            return this.onValueSave();
        }
    }

    onClickEditRow() {
        this.props.onClickEditRow(this.props.rowId, this.props.column.name);
    }

    render() {
        if (this.props.rowUnderEdit) {
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
                            onInputKeyDown={this.closeEdit}
                            autoFocus={this.props.autoFocus}
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
