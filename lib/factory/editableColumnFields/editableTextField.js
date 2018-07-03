import React, {Component} from 'react';
import {debounce} from "lodash";

class EditableTextField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentValue: this.props.value,
            value: this.props.value,
            isSaving: false
        };

        this.onValueSave = debounce(this.onValueSave.bind(this), 600);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.editingRow = this.editingRow.bind(this);
    }

    onChangeValue(event) {
        const value = event.target.value;
        this.setState({
            currentValue: value
        });
    }

    onValueSave() {
        this.setState({
            isSaving: true
        });

        return this.props.onUpdateField(this.props.rowId, this.props.column.value, this.state.currentValue)
        .then(() => {
            this.setState({ isSaving: false, value: this.state.currentValue });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row edited successfully', 'ok');
        })
        .catch(() => {
            this.setState({ isSaving: false, currentValue: this.state.value });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    closeEdit(event) {
        if (event.key == 'Escape') {
            return this.onValueSave();
        }
    }

    onClickEditRow() {
        this.setState({ currentValue: this.state.value });
        this.props.onClickEditRow(this.props.rowId, this.props.column.name)
    }

    onBlur() {
        return this.onValueSave();
    }

    moveCaretAtEnd(event) {
        const input = event.target;
        input.focus();
        const position = input.value.length;
        input.setSelectionRange(position, position);
    }

    editingRow() {
        return this.props.rowUnderEdit &&
            this.props.rowUnderEditId == this.props.rowId &&
            this.props.columnUnderEditId == this.props.column.name;
    }

    render() {
        if (!this.editingRow()) {
            return (
                <td key={this.props.column.value}
                    onClick={this.onClickEditRow}>
                    {this.state.value}
                </td>
            );
        } else if (this.editingRow()) {
            return (
                <td key={this.props.column.value}>
                    {this.state.isSaving && <span>Saving</span>}
                    <input type='text'
                           value={this.state.currentValue}
                           onChange={(this.onChangeValue)}
                           onKeyDown={this.closeEdit}
                           autoFocus
                           className="n-inputfield form-control"
                           onBlur={this.onBlur}
                           onFocus={this.moveCaretAtEnd}
                           style={{width: '100%', paddingLeft: '8px', paddingRight: '8px'}}/>
                </td>
            );
        }
    }

}

export default EditableTextField;
