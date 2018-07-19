import React from 'react';
import {shallow, mount} from 'enzyme';
import EditableSelectField from '../../../lib/factory/editableColumnFields/editableSelectField';
import {flushPromises} from '../../helper/index';

describe('EditableSelectField', () => {
    const mockOnChangeEditRow = jest.fn();
    const mockOnClickEditRow = jest.fn();
    let editableSelectField = shallow(<EditableSelectField column={{ name: 'testName', value: 'testValue' }} selectOptions={[]} onClickEditRow={mockOnClickEditRow} onChangeEditRow={mockOnChangeEditRow} rowId={1} onUpdateField={() => Promise.resolve()} />);

    it('renders properly', () => {
        expect(editableSelectField).toMatchSnapshot();
    });

    it('contains a td without Select if the row is not under edit', () => {
        expect(editableSelectField.find('td').length).toEqual(1);
        expect(editableSelectField.find('Select').length).toEqual(0);
    });

    it('changes to be editable on click', () => {
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        editableSelectField.find('td').simulate('click', event);
        expect(mockOnClickEditRow).toBeCalledWith(1, 'testName');
    });

    it('contains a td and an Select if the row is under edit', () => {
        editableSelectField.setProps({rowUnderEdit: true});
        expect(editableSelectField.find('td').length).toEqual(1);
        expect(editableSelectField.find('Select').length).toEqual(1);
    });

    it('loads default value', () => {
        editableSelectField.setState({currentValue: {value: 1, label: 'Hungary'}});
        editableSelectField.setProps({selectOptions: [{value: 1, label: 'Hungary'}], value: 1});
        editableSelectField.setProps({rowUnderEdit: false});

        expect(editableSelectField.find('Select').length).toEqual(0);
        expect(editableSelectField.find('td').text()).toEqual('Hungary');

        editableSelectField.setProps({rowUnderEdit: true});

        expect(editableSelectField.find('Select').length).toEqual(1);
        expect(editableSelectField.find('Select').prop('value')).toEqual({value: 1, label: 'Hungary'});
    });

    it('saves changes on blur with error', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select').simulate('blur');
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');
    });

    it('saves changes on blur successfully', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select').simulate('blur');
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
    });

    it('stores new value on change', async () => {
        editableSelectField.setState({currentValue: '' });
        editableSelectField.find('Select').simulate('change', 'newValue');
        await flushPromises();
        expect(editableSelectField.state('currentValue')).toEqual('newValue');
    });


    it('saves row changes on enter with error', async () => {
        editableSelectField = mount(
            <EditableSelectField
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                onClickEditRow={mockOnClickEditRow}
                onChangeEditRow={mockOnChangeEditRow}
                rowId={1}
                onUpdateField={() => Promise.resolve()}
                rowUnderEdit={true}
            />
        );
        const mockOnUpdateRow = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select input').simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');
    });

    it('saves row changes on enter successfully', async () => {
        editableSelectField = mount(
            <EditableSelectField
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                onClickEditRow={mockOnClickEditRow}
                onChangeEditRow={mockOnChangeEditRow}
                rowId={1}
                onUpdateField={() => Promise.resolve()}
                rowUnderEdit={true}
            />
        );
        const mockOnUpdateRow = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select input').simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
    });

    it('saves field changes on enter successfully', async () => {

        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField = mount(
            <EditableSelectField
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
            />
        );

        editableSelectField.setState({currentValue: 'testing'});
        editableSelectField.find('Select input').simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableSelectField.state('value')).toEqual('testing');
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
    });

    it(`doesn't save field changes on any button press`, async () => {

        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableSelectField = mount(
            <EditableSelectField
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
            />
        );

        editableSelectField.setState({currentValue: 'testing'});
        editableSelectField.find('Select input').simulate('keydown', {key: 'Any'});
        expect(mockOnUpdateField).not.toBeCalled();
    });

    it(`doesn't save changes on blur when editing row`, async () => {

        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableSelectField = mount(
            <EditableSelectField
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateRow={() => jest.fn()}
                onUpdateField={mockOnUpdateField}
            />
        );

        editableSelectField.find('Select input').simulate('blur');
        expect(mockOnUpdateField).not.toBeCalled();
    });

});
