import React, {Component} from 'react';
import {
    Button,
    Table as BsTable,
    Modal,
    Glyphicon
} from 'react-bootstrap';
import {isEmpty, isEqual, delay, get, defaultTo} from 'lodash';
import { read_cookie as readCookie, bake_cookie as bakeCookie, delete_cookie as deleteCookie } from 'sfcookies';

import SelectField from '../factory/filterFields/selectField';
import TextField from '../factory/filterFields/textField';
import {filterByLabel, filterByMultiSelectLabel, sorting} from '../actions/index';
import Footer from './footer';
import Message from './message';

import EditableTextField from '../factory/editableColumnFields/editableTextField';
import EditableSelectField from '../factory/editableColumnFields/editableSelectField';
import EditableDateField from "../factory/editableColumnFields/editableDateField";

class Table2 extends Component {
    constructor(props) {
        super(props);

        const storedFilters = readCookie(this.props.name);

        let tableData = this.props.data;

        Object.entries(storedFilters).forEach(activeFilter => {
            tableData = this.filterTableData(activeFilter, tableData);
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
            startDate: null
        }

        this.onFilterInputChange = this.onFilterInputChange.bind(this);
        this.refreshTableData = this.refreshTableData.bind(this);
        this.onPageSizeChange = this.onPageSizeChange.bind(this);
        this.onMultiSelectFilterInputChange = this.onMultiSelectFilterInputChange.bind(this);
        this.filterByTextInputField = this.filterByTextInputField.bind(this);
        this.filterByMultiSelectInputField = this.filterByMultiSelectInputField.bind(this);
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
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!isEqual(this.state.activeFilters, nextState.activeFilters) || (!isEqual(this.props.data, nextProps.data))) {
            let tableData = nextProps.data;

            Object.entries(nextState.activeFilters).forEach(activeFilter => {
                tableData = this.filterTableData(activeFilter, tableData);
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

    filterTableData(activeFilter, tableData) {
        const {type} = activeFilter[1];
        const filterableProperty = activeFilter[1].filterableProperty;
        const value = activeFilter[1].value;

        return this.filterByFields(type, filterableProperty, value, tableData);
    }

    filterByFields(type, filterableProperty, value, tableData) {
        let newTableData;
        if (type == 'multiSelect') {
            newTableData = this.filterByMultiSelectInputField(filterableProperty, value, tableData);
        }
        if (type == 'text') {
            newTableData = this.filterByTextInputField(filterableProperty, value, tableData);
        }
        return newTableData;
    }

    filterByMultiSelectInputField(filterableProperty, value, tableData) {
        if (!isEmpty(value)) {
            return filterByMultiSelectLabel(tableData, filterableProperty, value);
        } else {
            return tableData;
        }
    }

    filterByTextInputField(filterableProperty, value, tableData) {
        return filterByLabel(tableData, filterableProperty, value);
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
                return (
                    <th key={row.name}>
                        {row.filterable && (row.filterType == 'text')
                        && this.addTextInputField(row.name, row.filterableProperty)}
                        {row.filterable && (row.filterType == 'select')
                        && this.addSelectInputField(row.name, row.filterableProperty, row.selectOptions)}
                        {!row.filterable
                        && this.addEmptyFilterArea()}
                    </th>
                )
            })
        );
    }

    addTextInputField(fieldName, filterableProperty) {
        return (
            <TextField name={fieldName} filterableProperty={filterableProperty} onChange={this.onFilterInputChange} value={get(this.state.activeFilters, `${filterableProperty}.value`, '')}/>
        );
    }

    onMultiSelectFilterInputChange(name, filterableProperty, value) {
        const type = 'multiSelect';
        const activeFilters = {...this.state.activeFilters, [name]: {value, filterableProperty, type}}
        this.refreshActiveFilters(activeFilters);
    }

    addSelectInputField(fieldName, filterableProperty, selectableItems) {
        return (
            <SelectField name={fieldName}
                         options={selectableItems}
                         filterableProperty={filterableProperty}
                         onChange={this.onMultiSelectFilterInputChange}
                         value={get(this.state.activeFilters, `${filterableProperty}.value`, '')}
            />
        );
    }

    onFilterInputChange(filterableProperty, event) {
        const name = event.target.name;
        const value = event.target.value;

        if (!isEmpty(name)) {
            const type = 'text';
            const activeFilters = {...this.state.activeFilters, [name]: {value, filterableProperty, type}}
            this.refreshActiveFilters(activeFilters);
        }
    }

    onPageSizeChange(numberOfRowsShow) {
        this.refreshNumberOfRowsShow(numberOfRowsShow);
    }

    addEmptyFilterArea() {
        return (
            <span></span>
        );
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

    getDataRows() {
        let start = this.getTableDataStartIndexForPaginate();
        let end = this.getTableDataEndIndexForPaginate();
        let rowIndex = 0;

        return (
            this.state.tableData.slice(start, end).map((row) => {
                rowIndex++;

                return (
                    <tr key={rowIndex} style={{height: '100%'}}>
                        {
                            this.props.columns.map((column) => {
                                const onClickEditRow = () => this.onClickEditRow(row.id, column.name);
                                const onFinishEditRow = () => this.onFinishEditRow(row.id, column.name);
                                if (!column.filterType || !column.editable) {
                                    return (
                                        <td key={rowIndex+column.name}>{get(row, column.value)}</td>
                                    );
                                } else if (column.filterType == 'text' && column.updateType != 'date') {
                                    return (
                                        <EditableTextField key={column.name}
                                                           value={get(row, column.value)}
                                                           rowUnderEdit={this.state.rowUnderEdit}
                                                           onUpdateField={column.updateFunction}
                                                           rowUnderEditId={this.state.rowUnderEditId}
                                                           columnUnderEditId={this.state.columnUnderEditId}
                                                           rowId={row.id}
                                                           column={column}
                                                           onClickEditRow={onClickEditRow}
                                                           onFinishEditRow={onFinishEditRow}
                                                           handleShowMessage={this.handleShowMessage}
                                        />
                                    )
                                } else if (column.filterType == 'select' && column.updateType != 'date') {
                                    const optionId = get(row, column.value);
                                    const value = column.selectOptions.find(option => option.value == optionId);
                                    return (
                                        <EditableSelectField key={column.name}
                                                             value={value}
                                                             selectOptions={column.selectOptions}
                                                             rowUnderEdit={this.state.rowUnderEdit}
                                                             onUpdateField={column.updateFunction}
                                                             rowUnderEditId={this.state.rowUnderEditId}
                                                             columnUnderEditId={this.state.columnUnderEditId}
                                                             rowId={row.id}
                                                             column={column}
                                                             onClickEditRow={onClickEditRow}
                                                             onFinishEditRow={onFinishEditRow}
                                                             handleShowMessage={this.handleShowMessage}
                                        />
                                    );
                                }
                                if ((column.filterType == 'text' || column.filterType == 'select') && column.updateType == 'date') {
                                    return (
                                        <EditableDateField key={column.name}
                                                           value={get(row, column.value)}
                                                           selectOptions={column.selectOptions}
                                                           rowUnderEdit={this.state.rowUnderEdit}
                                                           rowUnderEditId={this.state.rowUnderEditId}
                                                           onUpdateField={column.updateFunction}
                                                           columnUnderEditId={this.state.columnUnderEditId}
                                                           rowId={row.id}
                                                           column={column}
                                                           onClickEditRow={onClickEditRow}
                                                           onFinishEditRow={onFinishEditRow}
                                        />
                                    );
                                }
                            })
                        }
                        <td key={row.id}>
                            {
                                this.props.onDeleteRow &&
                                <ul className="list-inline table-action">
                                    <li className="list-inline-item" key={row.id}>
                                        <span className="icon icon-delete" onClick={() => this.onDeleteRow(row.id)}/>
                                    </li>
                                </ul>

                            }
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
            <div>
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
                    />
                </BsTable>
            </div>
        );
    }
}

export default Table2;
