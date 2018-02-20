import React, {Component} from 'react';
import {
    Button,
    Col,
    Table as BsTable,
    FormControl,
    Checkbox,
    Modal,
    Popover,
    Tooltip,
    OverlayTrigger,
    Alert
} from 'react-bootstrap';
import {isEmpty} from 'lodash';

import SelectField from '../factory/fields/selectField';
import TextField from '../factory/fields/textField';
import {filterByLabel, filterByMultiSelectLabel, sorting, getValueFromObjectPropertyByName} from '../actions/index';
import Footer from './footer';

import EditableTextField from '../factory/editableColumnFields/editableTextField';
import EditableSelectField from '../factory/editableColumnFields/editableSelectField';

import {delay} from 'lodash';

import TableFieldFactory from '../factory/tableFieldFactory';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';
import EditableDateField from "../factory/editableColumnFields/editableDateField";

class Table2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableData: this.props.data,
            activeFilters: {},
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
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.activeFilters != nextState.activeFilters) {
            let tableData = this.props.data;

            Object.entries(nextState.activeFilters).map(activeFilter => {
                tableData = this.filterTableData(activeFilter, tableData);
            });

            this.refreshTableData(tableData);

            return true;
        } else if ((this.state.tableData != nextState.tableData)
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
                            <span className="glyphicon glyphicon-sort-by-attributes" id={row.sortableProperty}></span>
                            }
                            {row.sortable &&
                            this.state.sortBy.propertyName === row.sortableProperty &&
                            this.state.sortBy.order === 'DESC' &&
                            <span className="glyphicon glyphicon-sort-by-attributes-alt"
                                  id={row.sortableProperty}></span>
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
            <TextField name={fieldName} filterableProperty={filterableProperty} onChange={this.onFilterInputChange}/>
        );
    }

    addSelectInputField(fieldName, filterableProperty, selectableItems) {
        return (
            <SelectField name={fieldName}
                         options={selectableItems}
                         filterableProperty={filterableProperty}
                         onChange={this.onMultiSelectFilterInputChange}/>
        );
    }

    onMultiSelectFilterInputChange(name, filterableProperty, value) {
        const type = 'multiSelect';
        const activeFilters = {...this.state.activeFilters, [name]: {value, filterableProperty, type}}
        this.refreshActiveFilters(activeFilters);
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
        console.log('finished');
        this.setState({
            rowUnderEdit: false,
            rowUnderEditId: rowId,
            columnUnderEditId: columnId
        });
    }

    getDataRows() {
        let start = this.getTableDataStartIndexForPaginate();
        let end = this.getTableDataEndIndexForPaginate();

        return (
            this.state.tableData.slice(start, end).map((row) => {
                return (
                    <tr key={row.id} style={{height: '100%'}}>
                        {
                            this.props.columns.map((column) => {
                                if (!column.filterType || !column.editable) {
                                    return (
                                        <td key={column.name}>{getValueFromObjectPropertyByName(row, column.value)}</td>
                                    );
                                } else if (column.filterType == 'text' && column.updateType != 'date') {
                                    return (
                                        <EditableTextField key={column.name}
                                                           value={getValueFromObjectPropertyByName(row, column.value)}
                                                           rowUnderEdit={this.state.rowUnderEdit}
                                                           onUpdateField={column.updateFunction}
                                                           rowUnderEditId={this.state.rowUnderEditId}
                                                           columnUnderEditId={this.state.columnUnderEditId}
                                                           rowId={row.id}
                                                           column={column}
                                                           onClickEditRow={() => this.onClickEditRow(row.id, column.name)}
                                                           onFinishEditRow={() => this.onFinishEditRow(row.id, column.name)}
                                        />
                                    )
                                } else if (column.filterType == 'select' && column.updateType != 'date') {
                                    return (
                                        <EditableSelectField key={column.name}
                                                             value={getValueFromObjectPropertyByName(row, column.value)}
                                                             selectOptions={column.selectOptions}
                                                             rowUnderEdit={this.state.rowUnderEdit}
                                                             rowUnderEditId={this.state.rowUnderEditId}
                                                             columnUnderEditId={this.state.columnUnderEditId}
                                                             rowId={row.id}
                                                             column={column}
                                                             onClickEditRow={() => this.onClickEditRow(row.id, column.name)}
                                        />
                                    );
                                }
                                if ((column.filterType == 'text' || column.filterType == 'select') && column.updateType == 'date') {
                                    return (
                                        <EditableDateField key={column.name}
                                                           value={getValueFromObjectPropertyByName(row, column.value)}
                                                           selectOptions={column.selectOptions}
                                                           rowUnderEdit={this.state.rowUnderEdit}
                                                           rowUnderEditId={this.state.rowUnderEditId}
                                                           onUpdateField={column.updateFunction}
                                                           columnUnderEditId={this.state.columnUnderEditId}
                                                           rowId={row.id}
                                                           column={column}
                                                           onClickEditRow={() => this.onClickEditRow(row.id, column.name)}
                                                           onFinishEditRow={() => this.onFinishEditRow(row.id, column.name)}
                                        />
                                    );
                                }
                            })
                        }
                        <td>
                            {
                                this.props.onDeleteRow &&
                                <ul className="list-inline table-action">
                                    <li className="list-inline-item">
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
        try {
            const response = await this.props.onDeleteRow(this.state.idToDelete);
            this.removeItemFromData(this.state.idToDelete);
        } catch (error) {
            this.handleShowMessage(error.message);
        }
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
            messageText: ''
        });
    }

    handleShowMessage(text) {
        this.setState({
            isMessageActive: true,
            messageText: text
        });
        delay(this.handleDismiss, 4000);
    }

    handleStartDateChange(value) {
        console.log('changed: ', value);
    }

    render() {
        const popover = (
            <Popover id="modal-popover" title="popover">
                very popover. such engagement
            </Popover>
        );
        const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

        return (
            <div>
                {
                    (this.state.isMessageActive &&
                        <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                            <p>{this.state.messageText}</p>
                        </Alert>
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
                        <Button onClick={this.deleteRow} bsStyle="danger">Yes</Button>
                        }
                        {!this.state.isDeleting &&
                        <Button onClick={this.handleClose}>No</Button>
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
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getDataRows()}
                    </tbody>
                    <tfoot>
                    <Footer tableData={this.state.tableData}
                            onPageSizeChange={this.onPageSizeChange}
                            onCurrentPageNumberChange={this.onCurrentPageNumberChange}
                            defaultNumberOfRowsShow={this.state.numberOfRowsShow}
                    />
                    </tfoot>
                </BsTable>
            </div>
        );
    }
}

export default Table2;