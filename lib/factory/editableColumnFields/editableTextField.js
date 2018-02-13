import React, {Component} from 'react';
import {sortBy, debounce} from "lodash";

class EditableTextField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            isSaving: false
        };

        this.onChangeValue = debounce(this.onChangeValue.bind(this), 600);
        this.ize = this.ize.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }

    async onChangeValue(value) {
        this.setState({
            isSaving: true
        });

        console.log('onchange');
        try {
            const response = await this.props.onUpdateField(this.props.rowId, this.props.column.value, value);
            console.log(response);

            this.setState({
                isSaving: false
            });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
        } catch (error) {
            console.log(error);
            this.setState({
                isSaving: false
            });
        }
    }

    ize(event) {
        const value = event.target.value;
        this.setState({
            value
        });
        this.onChangeValue(value);
    }

    closeEdit(event) {
        if (event.key == 'Escape') {
            console.log(event.key);
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
        }
    }

    onClickEditRow() {
        this.props.onClickEditRow(this.props.rowId, this.props.column.name)
    }

    render() {
        if (!this.props.rowUnderEdit ||
            this.props.rowUnderEditId != this.props.rowId ||
            this.props.columnUnderEditId != this.props.column.name) {
            return (
                <td key={this.props.column.value}
                    onClick={this.onClickEditRow}>
                    {this.state.value}
                </td>
            );
        } else if (this.props.rowUnderEdit &&
            this.props.rowUnderEditId == this.props.rowId &&
            this.props.columnUnderEditId == this.props.column.name) {
            return (
                <td key={this.props.column.value}>
                    {this.state.isSaving && <span>Saving</span>}
                    <input type='text'
                           value={this.state.value}
                           onChange={this.ize}
                           onKeyDown={this.closeEdit}
                           autoFocus
                           style={{width: '100%', paddingLeft: '5px', paddingRight: '5px'}}/>
                </td>
            );
        }
    }

}

export default EditableTextField;