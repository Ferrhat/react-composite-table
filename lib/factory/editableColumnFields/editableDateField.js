import React, {Component} from 'react';
import {sortBy, debounce} from "lodash";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';

import moment from 'moment';

class EditableDateField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            isSaving: false
        };

        this.onChangeValue = debounce(this.onChangeValue.bind(this), 600);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }

    async onChangeValue(value) {
        this.setState({
            isSaving: true
        });

        const response = await this.props.onUpdateField(this.props.rowId, this.props.column.value, value).then(() => {
            this.setState({
                isSaving: false
            });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row edited successfully', 'ok');
        }).catch((error) => {
            this.setState({
                isSaving: false
            });
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    onChangeDate(date) {
        const dateValue = date.format('YYYY-MM-DD');

        this.setState({
            value: dateValue
        });
        this.onChangeValue(dateValue);
    }

    closeEdit() {
        this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
    }

    onClickEditRow() {
        this.props.onClickEditRow(this.props.rowId, this.props.column.name)
    }

    editingRow() {
        return this.props.rowUnderEdit &&
            this.props.rowUnderEditId == this.props.rowId &&
            this.props.columnUnderEditId == this.props.column.name;
    }

    render() {
        if (this.editingRow()) {
            let datum = moment(this.state.value, "YYYY-MM-DD");

            return (
                <td key={this.props.column.value}>
                    {this.state.isSaving && <span>Saving</span>}
                    <DatePicker
                        selected={datum}
                        onChange={this.onChangeDate}
                        dateFormat="YYYY.MM.DD"
                        onClickOutside={this.closeEdit}
                        autoFocus
                    />
                </td>
            );
        }
        return (
            <td key={this.props.column.value}
                onClick={this.onClickEditRow}>
                {this.state.value}
            </td>
        );
    }

}

export default EditableDateField;
