import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';
import {get, defaultTo, debounce} from 'lodash';
import {validateField} from '../../actions/index';

class EditableTextField extends Component {

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
        this.onBlur = this.onBlur.bind(this);
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

    onChangeValue(event) {
        const value = event.target.value;
        this.props.onChangeEditRow(value);
        this.setState({
            currentValue: value,
            isEdited: true,
        }, () => {
            this.getErrors();
        });
    }

    async onRowValueSave() {
        this.setState({
            isSaving: true
        });
        this.props.onUpdateRow()
        .then((status) => {
            this.setState({ isSaving: false, isEdited: false, value: this.state.currentValue });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            if (status == 'saved') {
                this.props.handleShowMessage('Selected row edited successfully', 'ok');
            }
        })
        .catch(() => {
            this.setState({ isSaving: false, isEdited: false, currentValue: this.props.value });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage('Selected row could not be saved', 'error');
        });
    }

    async onValueSave() {
        if (this.state.isEdited) {
            this.setState({
                isSaving: true
            });

            this.props.onUpdateField(this.props.rowId, this.props.column.value, this.state.currentValue)
            .then(() => {
                this.setState({ isSaving: false, isEdited: false, value: this.state.currentValue });
                this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
                this.props.handleShowMessage('Selected row edited successfully', 'ok');
            })
            .catch(() => {
                this.setState({ isSaving: false, isEdited: false, currentValue: this.props.value });
                this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
                this.props.handleShowMessage('Selected row could not be saved', 'error');
            });
        } else {
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
        }
    }

    closeEdit(event) {
        if ((event.key == 'Escape' || event.key == 'Enter')) {
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
        this.setState({ currentValue: this.props.value });
        this.props.onClickEditRow(this.props.rowId, this.props.column.name)
    }

    onBlur() {
        this.getErrorsNow(() => {
            if (!this.props.onUpdateRow && this.state.isValid) {
                return this.onValueSave();
            }
        });
    }

    moveCaretAtEnd(event) {
        const input = event.target;
        input.focus();
        const position = input.value.length;
        input.setSelectionRange(position, position);
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
            return (
                <td key={this.props.column.value}>
                    {tooltip(
                        <div>
                            {this.state.isSaving && <span>Saving</span>}
                            <input type='text'
                                value={this.state.currentValue}
                                onChange={(this.onChangeValue)}
                                onKeyDown={this.closeEdit}
                                className={`n-inputfield form-control ${invalidClassName}`}
                                onBlur={this.onBlur}
                                onFocus={this.moveCaretAtEnd}
                                autoFocus={this.props.autoFocus}
                                style={{width: '100%', paddingLeft: '8px', paddingRight: '8px'}}/>
                        </div>
                    )}
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
