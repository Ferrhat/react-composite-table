import React, {Component} from 'react';

class EditableTextField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentValue: this.props.value,
            isSaving: false
        };

        this.onValueSave = this.onValueSave.bind(this);
        this.onRowValueSave = this.onRowValueSave.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChangeValue(event) {
        const value = event.target.value;
        this.props.onChangeEditRow(value);
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
        if (event.key == 'Escape' || event.key == 'Enter') {
            if (this.props.onUpdateRow) {
                this.onRowValueSave();
            } else {
                this.onValueSave();
            }
        }
    }

    onClickEditRow() {
        this.setState({ currentValue: this.props.value });
        this.props.onClickEditRow(this.props.rowId, this.props.column.name)
    }

    onBlur() {
        if (!this.props.onUpdateRow) {
            return this.onValueSave();
        }
    }

    moveCaretAtEnd(event) {
        const input = event.target;
        input.focus();
        const position = input.value.length;
        input.setSelectionRange(position, position);
    }

    render() {
        if (this.props.rowUnderEdit) {
            return (
                <td key={this.props.column.value}>
                    {this.state.isSaving && <span>Saving</span>}
                    <input type='text'
                           value={this.state.currentValue}
                           onChange={(this.onChangeValue)}
                           onKeyDown={this.closeEdit}
                           className="n-inputfield form-control"
                           onBlur={this.onBlur}
                           onFocus={this.moveCaretAtEnd}
                           autoFocus={this.props.autoFocus}
                           style={{width: '100%', paddingLeft: '8px', paddingRight: '8px'}}/>
                </td>
            );
        }
        return (
            <td key={this.props.column.value}
                onClick={this.onClickEditRow}>
                {this.props.value}
            </td>
        );
    }

}

export default EditableTextField;
