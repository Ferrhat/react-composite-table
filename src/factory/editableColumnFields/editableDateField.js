import React, {Component} from 'react';
import {get, defaultTo, debounce} from "lodash";
import DatePicker from 'react-datepicker';
import {Tooltip} from 'react-tippy';
import 'react-datepicker/dist/react-datepicker.min.css';
import {validateField} from '../../actions/index';

import moment from 'moment';

class EditableDateField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentValue: this.props.value,
            isSaving: false,
            errorMessage: '',
            isValid: true,
            isEdited: false,
        };

        this.onValueSave = this.onValueSave.bind(this);
        this.onRowValueSave = this.onRowValueSave.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.closeEditOnKeyDown = this.closeEditOnKeyDown.bind(this);
        this.getErrorsNow = this.getErrors.bind(this);
        this.getErrors = debounce(this.getErrors.bind(this), 500);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.rowUnderEdit && this.props.rowUnderEdit != nextProps.rowUnderEdit) {
            this.setState({currentValue: this.props.value}, () => {
                this.getErrorsNow();
            });
        }
    }

    async onRowValueSave() {
        this.setState({
            isSaving: true
        });

        this.props.onUpdateRow().then((status) => {
            this.setState({ isSaving: false, isEdited: false, value: this.state.currentValue });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            if (status == 'saved') {
                this.props.handleShowMessage('Selected row edited successfully', 'ok');
            }
        }).catch(() => {
            this.setState({ isSaving: false, isEdited: false, currentValue: this.props.value });
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    async onValueSave() {
        if (this.state.isEdited) {
            this.setState({
                isSaving: true
            });
            this.props.onUpdateField(this.props.rowId, this.props.column.value, this.state.currentValue).then(() => {
                this.setState({ isSaving: false, isEdited: false, value: this.state.currentValue });
                this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
                this.props.handleShowMessage('Selected row edited successfully', 'ok');
            }).catch(() => {
                this.setState({ isSaving: false, isEdited: false, currentValue: this.props.value });
                this.props.handleShowMessage('Selected row could not be saved', 'error');
            });
        } else {
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
        }
    }

    onChangeValue(date) {
        const dateValue = date.format('YYYY-MM-DD');

        this.props.onChangeEditRow(dateValue);
        this.setState({
            currentValue: dateValue,
            isEdited: true,
        }, () => {
            this.getErrors();
        });
    }

    closeEdit() {
        this.getErrorsNow(() => {
            if (!this.props.onUpdateRow  && this.state.isValid) {
                this.onValueSave();
            }
        });
    }

    closeEditOnKeyDown(event) {
        if (event.key == 'Escape' || event.key == 'Enter') {
            this.getErrorsNow(() => {
                if (this.state.isValid) {
                    if (this.props.onUpdateRow) {
                        this.onRowValueSave();
                    } else {
                        this.onValueSave();
                    }
                }
            });
        }
    }

    onClickEditRow() {
        this.props.onClickEditRow(this.props.rowId, this.props.column.name);
    }

    getErrors(callBack = () => {}) {
        const errors = validateField(defaultTo(this.props.validators, []), this.state.currentValue);
        this.props.validateRow();
        this.setState({
            errorMessage: get(errors, '0.message', ''),
            isValid: errors.length == 0,
        }, callBack);
    }

    render() {
        const tooltip = (content) => {
            const errorMessage = this.state.errorMessage;

            if (!errorMessage) {
                return content;
            }

            return (
                <Tooltip
                    title={errorMessage}
                    position="top"
                    trigger="manual"
                    arrow
                    sticky
                    size='big'
                    open={true}
                    theme={'red'}
                >
                    {content}
                </Tooltip>
            );
        };

        const invalidClassName = this.state.isValid ? '' : this.props.invalidClassName;

        if (this.props.rowUnderEdit) {
            let datum = moment(this.state.currentValue, "YYYY-MM-DD");
            if (!datum.isValid()) {
                datum = moment();
            }

            return (
                <td key={this.props.column.value}>
                    {tooltip(
                        <div>
                            {this.state.isSaving && <span>Saving</span>}
                            <DatePicker
                                selected={datum}
                                onChange={this.onChangeValue}
                                dateFormat="YYYY.MM.DD"
                                onClickOutside={this.closeEdit}
                                autoFocus={this.props.autoFocus}
                                onKeyDown={this.closeEditOnKeyDown}
                                className={`n-inputfield form-control ${invalidClassName}`}
                            />
                        </div>
                    )}
                </td>
            );
        }
        let displayDate = this.props.value;
        if (this.props.column.dateFormat) {
            displayDate = moment(displayDate).format(this.props.column.dateFormat);
        }
        return (
            <td key={this.props.column.value}
                onClick={this.onClickEditRow}>
                {displayDate}
            </td>
        );
    }

}

export default EditableDateField;
