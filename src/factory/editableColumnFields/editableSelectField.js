import React, {Component} from 'react';
import Select from 'react-select';
import {sortBy, get, defaultTo, debounce} from "lodash";
import {Tooltip} from 'react-tippy';
import {validateField} from '../../actions/index';

class EditableSelectField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentValue: props.value,
            isSaving: false,
            errorMessage: '',
            isValid: true,
            isEdited: false,
        };

        this.onValueSave = this.onValueSave.bind(this);
        this.onRowValueSave = this.onRowValueSave.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
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

    onChangeValue(value) {
        this.props.onChangeEditRow(get(value, 'value', value));
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
                this.props.handleShowMessage(this.props.messages['editSuccess'], 'ok');
            }
        })
        .catch(() => {
            this.setState({ isSaving: false, isEdited: false, currentValue: this.props.value });
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
            this.props.handleShowMessage(this.props.messages['editFailed'], 'error');
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
                this.props.handleShowMessage(this.props.messages['editSuccess'], 'ok');
            })
            .catch(() => {
                this.setState({ isSaving: false, isEdited: false, currentValue: this.props.value });
                this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
                this.props.handleShowMessage(this.props.messages['editFailed'], 'error');
            });
        } else {
            this.props.onFinishEditRow(this.props.rowId, this.props.column.name);
        }
    }

    closeEdit(event) {
        if (event.key == 'Enter') {
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

    onBlur() {
        this.getErrorsNow(() => {
            if (!this.props.onUpdateRow && this.state.isValid) {
                return this.onValueSave();
            }
        });
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
            const optionId = get(this.state.currentValue, 'value', this.state.currentValue);
            const value = this.props.selectOptions.find(option => option.value == optionId);
            return (
                <td key={this.props.column.name}>
                    {tooltip(
                        <div>
                            <Select value={value}
                                    name={this.props.column.name}
                                    style={{height: "100%"}}
                                    options={sortBy(this.props.selectOptions, 'label')}
                                    onChange={this.onChangeValue}
                                    onBlur={this.onBlur}
                                    onKeyDown={this.closeEdit}
                                    autoFocus={this.props.autoFocus}
                                    backspaceRemovesValue={false}
                                    className={invalidClassName}
                            />
                        </div>
                    )}
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
