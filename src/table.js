import React, {Component} from 'react';
import {Button, Col, Table as BsTable, FormControl, Checkbox} from 'react-bootstrap';
import {isEmpty} from 'lodash';

import SelectField from './factory/fields/selectField';
import TextField from './factory/fields/textField';
import {filterByLabel, filterByMultiSelectLabel, sorting, getValueFromObjectPropertyByName} from './actions/index';
import Footer from './components/footer';

import TableFieldFactory from './factory/tableFieldFactory';

class Table2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableData: this.props.data,
            activeFilters: {},
            numberOfRowsShow: 10,
            currentPageNumber: 1,
            sortBy: {propertyName: null, order: 'ASC'}
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
            || (this.state.currentPageNumber != nextState.currentPageNumber)) {
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
                if(row.sortable) {
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
                            <span className="glyphicon glyphicon-sort-by-attributes-alt" id={row.sortableProperty}></span>
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

        if(this.state.numberOfRowsShow > 1) {
            startIndex = (this.state.currentPageNumber - 1) * this.state.numberOfRowsShow;
        } else {
            startIndex = this.state.currentPageNumber - 1;
        }

        return startIndex;
    }

    getTableDataEndIndexForPaginate() {
        let endIndex;

        if(this.state.numberOfRowsShow > 1) {
            endIndex = this.state.currentPageNumber * this.state.numberOfRowsShow;
        } else {
            endIndex = this.state.currentPageNumber;
        }

        return endIndex;
    }

    getDataRows() {
        let start = this.getTableDataStartIndexForPaginate();
        let end = this.getTableDataEndIndexForPaginate();

        return (
            this.state.tableData.slice(start, end).map((row) => {
                return (
                    <tr key={row.id}>
                        {
                            this.props.columns.map((column) => {
                                return <td key={column.name}>{ getValueFromObjectPropertyByName(row, column.value) }</td>
                            })
                        }
                        <td>
                            <ul className="list-inline table-action">
                                <li className="list-inline-item">
                                    <Button bsStyle="icon" title="Edit">
                                        <span className="icon icon-edit"/>
                                    </Button>
                                </li>
                                <li className="list-inline-item">
                                    <Button bsStyle="icon" title="Delete">
                                        <span className="icon icon-delete"/>
                                    </Button>
                                </li>
                            </ul>
                        </td>
                    </tr>
                )
            })
        )
    }

    render() {
        return (
            <BsTable striped hover bsClass={'n-table'} className={'n-table-standard n-table-filter'}>
                <thead>
                <tr>
                    {this.getColumnHeaders()}
                    <th width="100"></th>
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
        );
    }
}

export default Table2;