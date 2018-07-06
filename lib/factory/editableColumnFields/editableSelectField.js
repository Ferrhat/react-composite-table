import React, {Component} from 'react';
import Select from 'react-select';
import {sortBy, get} from "lodash";

class EditableSelectField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
        };

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.editingRow = this.editingRow.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({value: nextProps.value});
        }
    }

    async onChangeValue(value) {
        this.setState({
            isSaving: true
        });

        const response = await this.props.onUpdateField(this.props.rowId, this.props.column.value, value)
        .then(() => {
            this.setState({
                isSaving: false,
                value
            });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row edited successfully', 'ok');
        })
        .catch(() => {
            this.setState({ isSaving: false });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    onBlur() {
        this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
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
            return (
                <td key={this.props.column.name}>
                    <Select value={get(this.state.value, 'value', null)}
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
        const value = get(this.state.value, 'label', this.state.value);
        return (
            <td key={this.props.column.name}
                onClick={this.onClickEditRow}>
                { value }
            </td>
        );
    }

}

EditableSelectField.defaultProps = {
    options: [],
};

export default EditableSelectField;
