import React from 'react';
import {shallow} from 'enzyme';
import Table from '../../lib/components/table';


describe('Table', () => {
    const lodash = require('lodash');
    const sfcookies = require('sfcookies');

    jest.spyOn(lodash, 'delay').mockImplementation((f) => {
        return f;
    });

    const mockOnDeleteRowResolve = jest.fn(() => Promise.resolve());
    const mockOnDeleteRowReject = jest.fn(() => Promise.reject('error'));
    let table = shallow(<Table columns={[]} data={[]} onDeleteRow={mockOnDeleteRowResolve} />);

    it('renders properly', () => {
        expect(table).toMatchSnapshot();
    });

    it('contains a message component', () => {
        expect(table.find('Message').length).toEqual(0);
        table.setState({isMessageActive: true});
        table.update();
        expect(table.find('Message').length).toEqual(1);
    });

    it('hides the message on click', () => {
        expect(table.state('isMessageActive')).toEqual(true);
        table.find('Message').simulate('click');
        expect(table.state('isMessageActive')).toEqual(false);
    });

    it('hides the modal on clicking on cancel', () => {
        table.setState({
            isDeleting: false,
            isModalDialogActive: true,
            idToDelete: 1,
        });
        expect(table.find('#modalCancel').length).toEqual(1);
        table.find('#modalCancel').simulate('click');
        expect(table.state('isModalDialogActive')).toEqual(false);
        expect(table.state('idToDelete')).toEqual(-1);
    });

    it('confirms deletion without error', (done) => {
        table = shallow(<Table columns={[]} data={[{id: 1}, {id: 2}]} onDeleteRow={mockOnDeleteRowResolve} />);
        table.setState({
            isDeleting: false,
            isModalDialogActive: true,
            idToDelete: 1,
        });
        expect(table.find('#modalConfirm').length).toEqual(1);
        table.find('#modalConfirm').simulate('click');
        setImmediate(() => {
            expect(table.state('isMessageActive')).toEqual(true);
            expect(table.state('messageText')).toEqual('Selected row deleted successfully');
            expect(table.state('messageType')).toEqual('ok');
            expect(table.state('isModalDialogActive')).toEqual(false);
            expect(table.state('idToDelete')).toEqual(-1);
            done();
        });
    });

    it('confirms deletion with error', (done) => {
        table = shallow(<Table columns={[]} data={[]} onDeleteRow={mockOnDeleteRowReject} />);
        table.setState({
            isDeleting: false,
            isModalDialogActive: true,
            idToDelete: 1,
        });
        expect(table.find('#modalConfirm').length).toEqual(1);
        table.find('#modalConfirm').simulate('click');
        setImmediate(() => {
            expect(table.state('isMessageActive')).toEqual(true);
            expect(table.state('messageText')).toEqual('error');
            expect(table.state('messageType')).toEqual('error');
            done();
        });
    });

    it('displays delete dialog', (done) => {
        table = shallow(<Table columns={[]} data={[{id: 1}]} onDeleteRow={mockOnDeleteRowResolve} />);
        table.setState({
            isModalDialogActive: false,
            idToDelete: -1,
        });
        expect(table.find('.list-inline-item > span').length).toEqual(1);
        table.find('.list-inline-item > span').simulate('click');
        setImmediate(() => {
            expect(table.state('isModalDialogActive')).toEqual(true);
            expect(table.state('idToDelete')).toEqual(1);
            done();
        });
    });

    it('displays an editable text field', () => {
        table = shallow(<Table columns={[{
                label: 'Name',
                name: 'name',
                value: 'name',
                filterable: true,
                filterType: 'text',
                filterableProperty: 'name',
                editable: true,
                sortable: true,
                sortableProperty: 'name',
                updateFunction: jest.fn(),
        }]} data={[{id: 1}]} onDeleteRow={mockOnDeleteRowResolve} />);

        expect(table.find('EditableTextField').length).toEqual(1);
    });

    it('displays an editable select field', () => {
        table = shallow(<Table columns={[{
                label: 'Country',
                name: 'country_id',
                value: 'country_id',
                filterable: true,
                filterType: 'select',
                filterableProperty: 'country_id',
                editable: true,
                sortable: true,
                sortableProperty: 'country_id',
                selectOptions: [{label: 'Hungary', value: 1}],
                updateFunction: jest.fn(),
        }]} data={[{id: 1}]} onDeleteRow={mockOnDeleteRowResolve} />);

        expect(table.find('EditableSelectField').length).toEqual(1);
    });

    it('displays an editable date field', () => {
        table = shallow(<Table columns={[{
                label: 'Warranty',
                name: 'warranty',
                value: 'warranty',
                filterable: true,
                filterType: 'text',
                filterableProperty: 'warranty',
                editable: true,
                sortable: true,
                sortableProperty: 'warranty',
                updateType: 'date',
                updateFunction: jest.fn(),
        }]} data={[{id: 1}]} onDeleteRow={mockOnDeleteRowResolve} />);

        expect(table.find('EditableDateField').length).toEqual(1);
    });

    it(`doesn't display an editable date field`, () => {
        table = shallow(<Table columns={[{
                label: 'Warranty',
                name: 'warranty',
                value: 'warranty',
                filterable: true,
                filterType: 'nottext',
                filterableProperty: 'warranty',
                editable: true,
                sortable: true,
                sortableProperty: 'warranty',
                updateType: 'date',
                updateFunction: jest.fn(),
        }]} data={[{id: 1}]} onDeleteRow={mockOnDeleteRowResolve} />);

        expect(table.find('EditableDateField').length).toEqual(0);
    });

    it('displays a td if the field is not editable', () => {
        table = shallow(<Table columns={[{
                label: 'Name',
                name: 'name',
                value: 'name',
                filterable: false,
                filterType: 'text',
                filterableProperty: 'name',
                editable: false,
                sortable: false,
                sortableProperty: 'name',
                updateFunction: jest.fn(),
        }]} data={[{id: 1, name: 'test'}]} onDeleteRow={mockOnDeleteRowResolve} />);

        expect(table.find('tr > td').length).toEqual(2);
        expect(table.find('tr > td').first().text()).toEqual('test');
        expect(table.find('th > span').length).toEqual(1);
        expect(table.find('th > span').text()).toEqual('');
    });

    it('changes the field edit status', () => {
        table = shallow(<Table columns={[]} data={[]} onDeleteRow={mockOnDeleteRowResolve} />);
        table.setState({rowUnderEdit: false});
        table.instance().onClickEditRow(1, 2);
        expect(table.state('rowUnderEdit')).toEqual(true);
        expect(table.state('rowUnderEditId')).toEqual(1);
        expect(table.state('columnUnderEditId')).toEqual(2);
        table.instance().onFinishEditRow(3, 4);
        expect(table.state('rowUnderEdit')).toEqual(false);
        expect(table.state('rowUnderEditId')).toEqual(3);
        expect(table.state('columnUnderEditId')).toEqual(4);
    });

    it('calculates start index', () => {
        table = shallow(<Table columns={[]} data={[]} onDeleteRow={mockOnDeleteRowResolve} />);
        table.setState({numberOfRowsShow: 1, currentPageNumber: 1});
        let startIndex = table.instance().getTableDataStartIndexForPaginate();
        expect(startIndex).toEqual(0);

        table.setState({numberOfRowsShow: 2, currentPageNumber: 2});
        startIndex = table.instance().getTableDataStartIndexForPaginate();
        expect(startIndex).toEqual(2);
    });

    it('calculates end index', () => {
        table = shallow(<Table columns={[]} data={[]} onDeleteRow={mockOnDeleteRowResolve} />);
        table.setState({numberOfRowsShow: 1, currentPageNumber: 1});
        let endIndex = table.instance().getTableDataEndIndexForPaginate();
        expect(endIndex).toEqual(1);

        table.setState({numberOfRowsShow: 2, currentPageNumber: 2});
        endIndex = table.instance().getTableDataEndIndexForPaginate();
        expect(endIndex).toEqual(4);
    });

    it('changes page size', () => {
        table = shallow(<Table columns={[]} data={[]} onDeleteRow={mockOnDeleteRowResolve} />);
        table.setState({numberOfRowsShow: 1});
        table.instance().onPageSizeChange(3);
        expect(table.state('numberOfRowsShow')).toEqual(3);
    });

    it('changes page number', () => {
        table = shallow(<Table columns={[]} data={[]} onDeleteRow={mockOnDeleteRowResolve} />);
        table.setState({currentPageNumber: 1});
        table.instance().onCurrentPageNumberChange(3);
        expect(table.state('currentPageNumber')).toEqual(3);
    });

    it('filters by text', () => {
        table = shallow(<Table columns={[{
            label: 'Name',
            name: 'name',
            value: 'name',
            filterable: true,
            filterType: 'text',
            filterableProperty: 'name',
            editable: true,
            sortable: true,
            sortableProperty: 'name',
            updateFunction: jest.fn(),
        }]} data={[{id: 1, name: 'testValue'}]} onDeleteRow={mockOnDeleteRowResolve} name={'testTableName'} />);

        table.setState({activeFilters: {}});
        table.find('TextField').simulate('change', 'name', {target: {value: 'testValue', name: ''}});
        expect(table.state('activeFilters')).toEqual({});
        table.find('TextField').simulate('change', 'name', {target: {value: 'testValue', name: 'name'}});
        expect(table.state('activeFilters')).toEqual({name: {value: 'testValue', filterableProperty: 'name', type: 'text'}});
    });

    it('filters by select', () => {
        table = shallow(<Table columns={[{
            label: 'Country',
            name: 'country_id',
            value: 'country_id',
            filterable: true,
            filterType: 'select',
            filterableProperty: 'country_id',
            editable: true,
            sortable: true,
            sortableProperty: 'country_id',
            selectOptions: [{label: 'Hungary', value: 1}],
            updateFunction: jest.fn(),
        }]} data={[{id: 1, name: 'testValue'}]} onDeleteRow={mockOnDeleteRowResolve} />);

        table.setState({activeFilters: {}});
        table.find('SelectField').simulate('change', 'country_id', 'country_id', null);
        expect(table.state('activeFilters')).toEqual({country_id: {value: null, filterableProperty: 'country_id', type: 'multiSelect'}});
        table.find('SelectField').simulate('change', 'country_id', 'country_id', [{label: 'Hungary', value: 1}]);
        expect(table.state('activeFilters')).toEqual({country_id: {value: [{label: 'Hungary', value: 1}], filterableProperty: 'country_id', type: 'multiSelect'}});
    });

    it('sorts by name', () => {
        table = shallow(<Table columns={[{
                label: 'Name',
                name: 'name',
                value: 'name',
                filterable: true,
                filterType: 'text',
                filterableProperty: 'name',
                editable: true,
                sortable: true,
                sortableProperty: 'name',
                updateFunction: jest.fn(),
        }]} data={[{id: 1, name: 'A'}, {id: 2, name: 'B'}]} onDeleteRow={mockOnDeleteRowResolve} />);

        table.find('tr > th').first().simulate('click', {target: {id: 'name'}});
        expect(table.state('sortBy')).toEqual({propertyName: 'name', order: 'DESC'});
        expect(table.state('tableData')).toEqual([{id: 2, name: 'B'}, {id: 1, name: 'A'}]);
        table.find('tr > th').first().simulate('click', {target: {id: 'name'}});
        expect(table.state('sortBy')).toEqual({propertyName: 'name', order: 'ASC'});
        expect(table.state('tableData')).toEqual([{id: 1, name: 'A'}, {id: 2, name: 'B'}]);
    });

    it('resets filters', () => {
        table = shallow(<Table columns={[{
                label: 'Name',
                name: 'name',
                value: 'name',
                filterable: true,
                filterType: 'text',
                filterableProperty: 'name',
                editable: true,
                sortable: true,
                sortableProperty: 'name',
                updateFunction: jest.fn(),
        }]} data={[{id: 1, name: 'testValue'}]} onDeleteRow={mockOnDeleteRowResolve} />);

        table.setState({activeFilters: {name: {value: 'testValue', filterableProperty: 'name', type: 'text'}}});
        table.find('th > Button').simulate('click');
        expect(table.state('activeFilters')).toEqual({});
    });

    it('initializes filters', () => {
        jest.spyOn(sfcookies, 'read_cookie').mockImplementation((f) => {
            return {"name":{"value":"testValue111","filterableProperty":"name","type":"text"}};
        });

        table = shallow(<Table columns={[{
                label: 'Name',
                name: 'name',
                value: 'name',
                filterable: true,
                filterType: 'text',
                filterableProperty: 'name',
                editable: true,
                sortable: true,
                sortableProperty: 'name',
                updateFunction: jest.fn(),
        }]} data={[{id: 1, name: 'testValue'}]} onDeleteRow={mockOnDeleteRowResolve} />);

        expect(table.state('tableData')).toEqual([]);
    });


});
