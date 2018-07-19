import React, {Component} from 'react';
import {sortBy, debounce} from "lodash";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';

import moment from 'moment';

class EditableDateField extends Component {

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
        this.closeEditOnKeyDown = this.closeEditOnKeyDown.bind(this);
    }

    async onRowValueSave() {
        this.setState({
            isSaving: true
        });

        this.props.onUpdateRow().then(() => {
            this.setState({ isSaving: false, value: this.state.currentValue });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row edited successfully', 'ok');
        }).catch(() => {
            this.setState({ isSaving: false, currentValue: this.props.value });
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    async onValueSave() {
        this.setState({
            isSaving: true
        });
        this.props.onUpdateField(this.props.rowId, this.props.column.value, this.state.currentValue).then(() => {
            this.setState({ isSaving: false, value: this.state.currentValue });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row edited successfully', 'ok');
        }).catch(() => {
            this.setState({ isSaving: false, currentValue: this.props.value });
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    onChangeValue(date) {
        const dateValue = date.format('YYYY-MM-DD');

        this.props.onChangeEditRow(dateValue);
        this.setState({
            currentValue: dateValue
        });
    }

    closeEdit() {
        if (!this.props.onUpdateRow) {
            this.onValueSave();
        }
    }

    closeEditOnKeyDown(event) {
        if (event.key == 'Escape' || event.key == 'Enter') {
            if (this.props.onUpdateRow) {
                this.onRowValueSave();
            } else {
                this.onValueSave();
            }
        }
    }

    onClickEditRow() {
        this.props.onClickEditRow(this.props.rowId, this.props.column.name);
    }

    render() {
        if (this.props.rowUnderEdit) {
            let datum = moment(this.state.currentValue, "YYYY-MM-DD");

            return (
                <td key={this.props.column.value}>
                    {this.state.isSaving && <span>Saving</span>}
                    <DatePicker
                        selected={datum}
                        onChange={this.onChangeValue}
                        dateFormat="YYYY.MM.DD"
                        onClickOutside={this.closeEdit}
                        autoFocus={this.props.autoFocus}
                        onKeyDown={this.closeEditOnKeyDown}
                    />
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

export default EditableDateField;
