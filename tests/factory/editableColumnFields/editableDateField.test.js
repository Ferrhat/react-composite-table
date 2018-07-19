import React from 'react';
import {shallow, mount} from 'enzyme';
import moment from 'moment';
import EditableDateField from '../../../lib/factory/editableColumnFields/editableDateField';
import {flushPromises} from '../../helper/index';

describe('EditableDateField', () => {
    const mockOnClickEditRow = jest.fn();
    let editableDateField = mount(<EditableDateField column={{ name: 'testName', value: 'testValue' }} onClickEditRow={mockOnClickEditRow} rowId={1} onUpdateField={() => Promise.resolve()} />);

    it('renders properly', () => {
        expect(editableDateField).toMatchSnapshot();
    });

    it('contains a td without DatePicker if the row is not under edit', () => {
        expect(editableDateField.find('td').length).toEqual(1);
        expect(editableDateField.find('DatePicker').length).toEqual(0);
    });

    it('changes to be editable on click', () => {
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        editableDateField.find('td').simulate('click', event);
        expect(mockOnClickEditRow).toBeCalledWith(1, 'testName');
    });

    it('contains a td and an DatePicker if the row is under edit', () => {
        editableDateField.setProps({rowUnderEdit: true});
        expect(editableDateField.find('td').length).toEqual(1);
        expect(editableDateField.find('DatePicker').length).toEqual(1);
    });

    it('saves changes on change', async () => {
        const mockOnChangeEditRow = jest.fn();
        editableDateField.setState({currentValue: '2018-01-01'});

        editableDateField.setProps({onChangeEditRow: mockOnChangeEditRow, rowUnderEdit: true});
        editableDateField.find('DatePicker input').simulate('click');
        editableDateField.find('DatePicker div.react-datepicker__day').first().simulate('click');
        await flushPromises();
        expect(mockOnChangeEditRow).toBeCalledWith('2017-12-31');
    });


    it('saves changes on outside click successfully', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
            />
        );


        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.instance().closeEdit();
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('value')).toEqual('2018-01-01');
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
    });

    it('saves changes on outside click with error', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                value={'2000-01-01'}
            />
        );


        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.instance().closeEdit();
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('currentValue')).toEqual('2000-01-01');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');
    });

    it(`doesn't save row changes on outside click`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockOnUpdateRow = jest.fn(() => Promise.resolve());

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                onUpdateRow={mockOnUpdateRow}
            />
        );

        editableDateField.instance().closeEdit();
        expect(mockOnUpdateField).not.toBeCalled();
    });

    it('saves changes on escape successfully', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
            />
        );


        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.find('DatePicker').simulate('keydown', {key: 'Escape'});
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('value')).toEqual('2018-01-01');
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
    });

    it(`doesn't save changes on enter`, async () => {
        const mockOnUpdateRow = jest.fn(() => Promise.resolve());

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateRow={mockOnUpdateRow}
            />
        );

        editableDateField.find('DatePicker').simulate('keydown', {key: 'Any'});
        expect(mockOnUpdateRow).not.toBeCalled();
    });
    it('saves row changes on enter successfully', async () => {
        const mockOnUpdateRow = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateRow={mockOnUpdateRow}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
            />
        );


        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.find('DatePicker').simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateRow).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('value')).toEqual('2018-01-01');
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
    });

    it('saves row changes on enter with error', async () => {
        const mockOnUpdateRow = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateRow={mockOnUpdateRow}
                handleShowMessage={mockHandleShowMessage}
                value={'2000-01-01'}
            />
        );


        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.find('DatePicker').simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateRow).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('currentValue')).toEqual('2000-01-01');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');
    });

});
