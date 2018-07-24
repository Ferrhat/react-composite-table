import React, {Component} from 'react';
import {
    Button,
    Table as BsTable,
    Modal,
    Glyphicon
} from 'react-bootstrap';
import {isEmpty, isEqual, delay, get, defaultTo, find, isUndefined} from 'lodash';
import { read_cookie as readCookie, bake_cookie as bakeCookie, delete_cookie as deleteCookie } from 'sfcookies';

import {filterByLabel, filterByMultiSelectLabel, sorting} from '../actions/index';
import Footer from './footer';
import Message from './message';
import TableButton from './tableButton';
import CustomButtons from './customButtons';

import TableFieldFactory from '../factory/tableFieldFactory';
import FilterFactory from '../factory/filterFactory';

import {validateField} from '../actions/index';

import 'react-tippy/dist/tippy.css';
import '../style/tooltip.css';
import '../style/datepicker.css';


class Table2 extends Component {
    constructor(props) {
        super(props);

        const storedFilters = readCookie(this.props.name);

        let tableData = this.props.data;

        Object.entries(storedFilters).forEach(activeFilter => {
            const {type, filterableProperty, value} = activeFilter[1];
            tableData = this.filterByFields(type, filterableProperty, value, tableData);
        });

        this.state = {
            tableData: tableData,
            activeFilters: defaultTo(storedFilters, {}),
            numberOfRowsShow: 10,
            currentPageNumber: 1,
            sortBy: {propertyName: null, order: 'ASC'},
            rowUnderEdit: false,
            rowUnderEditId: -1,
            columnUnderEditId: '',
            isModalDialogActive: false,
            idToDelete: -1,
            isMessageActive: false,
            messageText: '',
            messageType: '',
            isDeleting: false,
            startDate: null,
            changedValues: {},
            isRowValid: true,
        }

        this.onFilterChange = this.onFilterChange.bind(this);
        this.refreshTableData = this.refreshTableData.bind(this);
        this.onPageSizeChange = this.onPageSizeChange.bind(this);
        this.onClickSortIcon = this.onClickSortIcon.bind(this);
        this.onCurrentPageNumberChange = this.onCurrentPageNumberChange.bind(this);
        this.getTableDataStartIndexForPaginate = this.getTableDataStartIndexForPaginate.bind(this);
        this.getTableDataEndIndexForPaginate = this.getTableDataEndIndexForPaginate.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.onFinishEditRow = this.onFinishEditRow.bind(this);
        this.onDeleteRow = this.onDeleteRow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShowMessage = this.handleShowMessage.bind(this);
        this.removeItemFromData = this.removeItemFromData.bind(this);
        this.resetActiveFilters = this.resetActiveFilters.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.onUpdateRow = this.onUpdateRow.bind(this);
        this.onClickSaveRow = this.onClickSaveRow.bind(this);
        this.validateRow = this.validateRow.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!isEqual(this.state.activeFilters, nextState.activeFilters) || (!isEqual(this.props.data, nextProps.data))) {
            let tableData = nextProps.data;

            Object.entries(nextState.activeFilters).forEach(activeFilter => {
                const {type, filterableProperty, value} = activeFilter[1];
                tableData = this.filterByFields(type, filterableProperty, value, tableData);
            });

            if (this.props.name) {
                bakeCookie(this.props.name, nextState.activeFilters);
            }
            this.refreshTableData(tableData);

            return true;
        } else if ((this.state.tableData != nextState.tableData)
            || (!isEqual(this.props.data, nextProps.data))
            || (!isEqual(this.props.columns, nextProps.columns))
            || (this.state.numberOfRowsShow != nextState.numberOfRowsShow)
            || (this.state.sortBy.propertyName != nextState.sortBy.propertyName)
            || (this.state.sortBy.order != nextState.sortBy.order)
            || (this.state.currentPageNumber != nextState.currentPageNumber)
            || (this.state.rowUnderEdit != nextState.rowUnderEdit)
            || (this.state.rowUnderEditId != nextState.rowUnderEditId)
            || (this.state.columnUnderEditId != nextState.columnUnderEditId)
            || (this.state.isModalDialogActive != nextState.isModalDialogActive)
            || (this.state.isMessageActive != nextState.isMessageActive)
            || (!isEqual(this.state.changedValues, nextState.changedValues))
            || (this.state.isRowValid != nextState.isRowValid)
            || (this.state.isDeleting != nextState.isDeleting)) {
            return true;
        } else {
            return false;
        }
    }

    refreshTableData(tableData) {
        this.setState({
            tableData
        });
    }

    refreshActiveFilters(activeFilters) {
        this.setState({
            activeFilters
        });
    }

    refreshNumberOfRowsShow(numberOfRowsShow) {
        this.setState({
            numberOfRowsShow
        });
    }

    refreshCurrentPageNumber(currentPageNumber) {
        this.setState({
            currentPageNumber
        });
    }

    onCurrentPageNumberChange(currentPageNumber) {
        this.refreshCurrentPageNumber(currentPageNumber);
    }

    resetActiveFilters() {
        this.setState({
            activeFilters: {}
        });
        deleteCookie(this.props.name);
    }

    filterByFields(type, filterableProperty, value, tableData) {
        let newTableData = tableData;
        if (type == 'multiSelect' && !isEmpty(value)) {
            newTableData = filterByMultiSelectLabel(tableData, filterableProperty, value);
        }
        if (type == 'text' && !isEmpty(value)) {
            newTableData = filterByLabel(tableData, filterableProperty, value);
        }
        return newTableData;
    }

    getColumnHeaders() {
        return (
            this.props.columns.map((row) => {
                if (row.sortable) {
                    return (
                        <th key={row.name}
                            id={row.sortableProperty}
                            className='table-header'
                            onClick={this.onClickSortIcon}>
                            {row.label}
                            &nbsp;&nbsp;
                            {row.sortable &&
                            this.state.sortBy.propertyName === row.sortableProperty &&
                            this.state.sortBy.order === 'ASC' &&
                            <Glyphicon glyph='sort-by-attributes' id={row.sortableProperty} />
                            }
                            {row.sortable &&
                            this.state.sortBy.propertyName === row.sortableProperty &&
                            this.state.sortBy.order === 'DESC' &&
                            <Glyphicon glyph='sort-by-attributes-alt' id={row.sortableProperty} />
                            }
                        </th>
                    )
                } else {
                    return (
                        <th key={row.name}>
                            {row.label}
                        </th>
                    )
                }
            })
        )
    }

    onClickSortIcon(event) {
        const propertyName = event.target.id;
        const sortByState = this.state.sortBy;
        let tableData = this.state.tableData;
        let order = sortByState.order === 'ASC' ? 'DESC' : 'ASC';

        tableData.sort((a, b) => sorting(a, b, order, propertyName));

        this.setState({
            tableData,
            sortBy: {propertyName, order}
        });
    }

    getColumnFilters() {
        return (
            this.props.columns.map((row) => {
                const data = {
                    name: row.name,
                    options: row.selectOptions,
                    filterableProperty: row.filterableProperty,
                    onChange: this.onFilterChange,
                    value: get(this.state.activeFilters, `${row.filterableProperty}.value`, ''),
                    filterable: row.filterable,
                    type: row.filterType,
                }
                return (
                    <th key={row.name}>
                        {FilterFactory.build(data)}
                    </th>
                )
            })
        );
    }

    onFilterChange(name, type, filterableProperty, value) {
        if (!isEmpty(name)) {
            const activeFilters = {...this.state.activeFilters, [name]: {value, filterableProperty, type}}
            this.refreshActiveFilters(activeFilters);
        }
    }

    onPageSizeChange(numberOfRowsShow) {
        this.refreshNumberOfRowsShow(numberOfRowsShow);
    }

    getTableDataStartIndexForPaginate() {
        let startIndex;

        if (this.state.numberOfRowsShow > 1) {
            startIndex = (this.state.currentPageNumber - 1) * this.state.numberOfRowsShow;
        } else {
            startIndex = this.state.currentPageNumber - 1;
        }

        return startIndex;
    }

    getTableDataEndIndexForPaginate() {
        let endIndex;

        if (this.state.numberOfRowsShow > 1) {
            endIndex = this.state.currentPageNumber * this.state.numberOfRowsShow;
        } else {
            endIndex = this.state.currentPageNumber;
        }

        return endIndex;
    }

    onClickEditRow(rowId, columnId) {
        this.setState({
            rowUnderEdit: true,
            rowUnderEditId: rowId,
            columnUnderEditId: columnId
        });
    }

    onFinishEditRow(rowId, columnId) {
        this.setState({
            rowUnderEdit: false,
            rowUnderEditId: rowId,
            columnUnderEditId: columnId
        });
    }

    onUpdateRow(rowId) {
        return this.props.onUpdateRow(rowId, this.state.changedValues).then(() => {
            this.setState({changedValues: {}});
            return Promise.resolve();
        }).catch((error) => {
            this.setState({changedValues: {}});
            return Promise.reject(error);
        });
    };

    onClickSaveRow() {
        if (!this.state.isRowValid) {
            this.handleShowMessage('Selected row could not be saved', 'error');
            return Promise.reject();
        }
        return this.onUpdateRow(this.state.rowUnderEditId).then(() => {
            this.handleShowMessage('Selected row edited successfully', 'ok');
            return Promise.resolve();
        }).catch(() => {
            this.handleShowMessage('Selected row could not be saved', 'error');
            return Promise.reject();
        });
    };

    renderButtons(row) {
        if (this.state.rowUnderEdit && this.props.onUpdateRow && row.id == this.state.rowUnderEditId) {
            return (
                <ul className="list-inline table-action" style={{'whiteSpace': 'nowrap'}}>
                    {this.state.isRowValid && <TableButton className='icon icon-save' onClick={() => this.onClickSaveRow().then(() => this.setState({rowUnderEdit: false, changedValues: {}}))}/>}
                    <TableButton className='icon icon-cancel' onClick={() => this.setState({rowUnderEdit: false, changedValues: {}})}/>
                </ul>
            );
        }
        return (
            <ul className="list-inline table-action" style={{'whiteSpace': 'nowrap'}}>
                {this.props.onDeleteRow && <TableButton className='icon icon-delete' onClick={() => this.onDeleteRow(row.id)} />}
                <CustomButtons buttons={this.props.buttons} row={row} />
            </ul>
        );
    }

    validateRow() {
        const row = find(this.state.tableData, row => row.id == this.state.rowUnderEditId);

        const allFieldsAreValid = this.props.columns.every(column => {
            const currentValue = this.state.changedValues[column.name];
            const value = isUndefined(currentValue) ? get(row, column.value) : currentValue;
            const errors = validateField(defaultTo(column.validators, []), value);
            return errors.length == 0;
        });

        this.setState({isRowValid: allFieldsAreValid});
    }

    getDataRows() {
        let start = this.getTableDataStartIndexForPaginate();
        let end = this.getTableDataEndIndexForPaginate();

        return (
            this.state.tableData.slice(start, end).map((row, rowIndex) => {
                return (
                    <tr key={rowIndex} style={{height: '100%'}}>
                        {
                            this.props.columns.map((column) => {
                                const onClickEditRow = () => {
                                    if (this.props.onUpdateRow && this.state.rowUnderEdit && this.state.rowUnderEditId != row.id) {
                                        this.onClickSaveRow();
                                    }
                                    this.onClickEditRow(row.id, column.name);
                                };
                                const onChangeEditRow = (value) => {
                                    const changedValues = Object.assign({}, this.state.changedValues, {[column.name]: value});
                                    this.setState({changedValues});
                                };
                                const onFinishEditRow = () => this.onFinishEditRow(row.id, column.name);


                                if (!column.filterType || !column.editable) {
                                    return (
                                        <td key={rowIndex+column.name}>{get(row, column.value)}</td>
                                    );
                                }

                                const rowUnderEdit = () => {
                                    return this.state.rowUnderEdit &&
                                            this.state.rowUnderEditId == row.id &&
                                            (this.props.onUpdateRow ||
                                            this.state.columnUnderEditId == column.name);
                                }

                                const type = defaultTo(column.updateType, column.filterType);

                                const data = {
                                    type: type,
                                    key: column.name,
                                    value: get(row, column.value),
                                    selectOptions: column.selectOptions,
                                    rowUnderEdit: rowUnderEdit(),
                                    onUpdateField: column.updateFunction,
                                    rowUnderEditId: this.state.rowUnderEditId,
                                    columnUnderEditId: this.state.columnUnderEditId,
                                    rowId: row.id,
                                    column: column,
                                    onClickEditRow: onClickEditRow,
                                    onChangeEditRow: onChangeEditRow,
                                    onFinishEditRow: onFinishEditRow,
                                    onUpdateRow: this.props.onUpdateRow ? () => this.onUpdateRow(row.id) : null,
                                    handleShowMessage: this.handleShowMessage,
                                    autoFocus: rowUnderEdit() && this.state.columnUnderEditId == column.name,
                                    validators: column.validators,
                                    validateRow: this.validateRow,
                                    invalidClassName: this.props.invalidClassName,
                                };
                                return TableFieldFactory.build(data);
                            })
                        }
                        <td key={row.id}>
                            {this.renderButtons(row)}
                        </td>
                    </tr>
                )
            })
        )
    }

    onDeleteRow(id) {
        this.setState({
            isModalDialogActive: true,
            idToDelete: id
        });
    }

    async deleteRow() {
        this.setState({
            isDeleting: true
        });
        const response = await this.props.onDeleteRow(this.state.idToDelete).then(() => {
            this.removeItemFromData(this.state.idToDelete);
            return this.handleShowMessage('Selected row deleted successfully', 'ok');
        })
        .catch((error) => this.handleShowMessage(error, 'error'));

        this.setState({
            isModalDialogActive: false,
            idToDelete: -1,
            isDeleting: false
        });
    }

    removeItemFromData(id) {
        const tableData = this.state.tableData.filter(row => {
            if (row.id != id) {
                return row;
            }
        });

        this.setState({
            tableData
        });
    }

    handleClose() {
        this.setState({
            isModalDialogActive: false,
            idToDelete: -1
        });
    }

    handleDismiss() {
        this.setState({
            isMessageActive: false,
            messageText: '',
            messageType: '',
        });
    }

    handleShowMessage(text, type) {
        this.setState({
            isMessageActive: true,
            messageText: text,
            messageType: type,
        });
        delay(this.handleDismiss, 8000);
    }

    render() {
        return (
            <div className='container-fluid table-component'>
                {
                    (this.state.isMessageActive &&
                        <Message onClick={this.handleDismiss} content={this.state.messageText} level={this.state.messageType} />
                    )
                }
                <Modal show={this.state.isModalDialogActive} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Do you want to delete the selected row with id: {this.state.idToDelete}?
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.state.isDeleting &&
                        <span className="icon-spinner"></span>
                        }
                        {!this.state.isDeleting &&
                        <Button onClick={this.handleClose} id="modalCancel">No</Button>
                        }
                        {!this.state.isDeleting &&
                        <Button onClick={this.deleteRow} bsStyle="defaultBlue" id="modalConfirm">Yes</Button>
                        }
                    </Modal.Footer>
                </Modal>
                <BsTable striped hover bsClass={'n-table'} className={'n-table-standard n-table-filter'}>
                    <thead>
                    <tr>
                        {this.getColumnHeaders()}
                        <th width="50"></th>
                    </tr>
                    <tr>
                        {this.getColumnFilters()}
                        <th>
                            <Button bsStyle="icon" title="Reset filters" onClick={this.resetActiveFilters} >
                                <span className="icon icon-close-rounded" style={{lineHeight: 'normal', fontSize: '1em'}} />
                            </Button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getDataRows()}
                    </tbody>
                    <Footer tableData={this.state.tableData}
                            onPageSizeChange={this.onPageSizeChange}
                            onCurrentPageNumberChange={this.onCurrentPageNumberChange}
                            defaultNumberOfRowsShow={this.state.numberOfRowsShow}
                            totalText={this.props.totalText}
                            itemsPerPageText={this.props.itemsPerPageText}
                    />
                </BsTable>
            </div>
        );
    }
}

Table2.defaultProps = {
    buttons: [],
    invalidClassName: 'invalid',
}

export default Table2;
