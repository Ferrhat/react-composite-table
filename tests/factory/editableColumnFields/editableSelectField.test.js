import React from 'react';
import {shallow, mount} from 'enzyme';
import EditableSelectField from '../../../lib/factory/editableColumnFields/editableSelectField';

describe('EditableSelectField', () => {
    const mockOnChange = jest.fn();
    const mockOnClickEditRow = jest.fn();
    const editableSelectField = shallow(<EditableSelectField column={{ name: 'testName', value: 'testValue' }} onClickEditRow={mockOnClickEditRow} rowId={1} onUpdateField={() => Promise.resolve()} />);

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
        editableSelectField.setProps({rowUnderEdit: true, rowUnderEditId: 1, columnUnderEditId: 'testName' }, () => {
            expect(editableSelectField.find('td').length).toEqual(1);
            expect(editableSelectField.find('Select').length).toEqual(1);
        });
    });

    it('saves changes on blur', () => {
        const mockOnFinishEditRow = jest.fn();
        editableSelectField.setProps({onFinishEditRow: mockOnFinishEditRow});
        editableSelectField.find('Select').simulate('blur');
        expect(mockOnFinishEditRow).toBeCalled();
    });

    it('saves changes on blur', () => {
        const mockOnFinishEditRow = jest.fn();
        editableSelectField.setProps({onFinishEditRow: mockOnFinishEditRow});
        editableSelectField.find('Select').simulate('blur');
        expect(mockOnFinishEditRow).toBeCalled();
    });

    it('saves changes on change', () => {
        let mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select').simulate('change');
        setImmediate(() => {
            expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');
        });

        mockOnUpdateField = jest.fn(() => Promise.resolve());
        editableSelectField.setProps({onUpdateField: mockOnUpdateField});
        editableSelectField.find('Select').simulate('change');
        setImmediate(() => {
            expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
        });
    });

    it('updates locally stored value', () => {
        editableSelectField.setProps({value: 'newValue'});
        expect(editableSelectField.state('value')).toEqual('newValue');
    });

});
