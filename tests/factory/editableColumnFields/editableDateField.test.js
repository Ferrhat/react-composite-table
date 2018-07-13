import React from 'react';
import {shallow, mount} from 'enzyme';
import EditableDateField from '../../../lib/factory/editableColumnFields/editableDateField';
import moment from 'moment';

describe('EditableDateField', () => {
    const mockOnClickEditRow = jest.fn();
    const editableDateField = mount(<EditableDateField column={{ name: 'testName', value: 'testValue' }} onClickEditRow={mockOnClickEditRow} rowId={1} onUpdateField={() => Promise.resolve()} />);

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
        editableDateField.setProps({rowUnderEdit: true, rowUnderEditId: 1, columnUnderEditId: 'testName' });
        expect(editableDateField.find('td').length).toEqual(1);
        expect(editableDateField.find('DatePicker').length).toEqual(1);
    });
/*
    it('saves changes on change', () => {
        let mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();
        const date = moment('2018-07-06');

        editableDateField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableDateField.find('DatePicker').simulate('blur');
        editableDateField.find('DatePicker').simulate('change', date);
        setImmediate(() => {
            expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');
        });

        mockOnUpdateField = jest.fn(() => Promise.resolve());
        editableDateField.setProps({onUpdateField: mockOnUpdateField});
        editableDateField.find('DatePicker').simulate('blur');
        editableDateField.find('DatePicker').simulate('change', date);
        setImmediate(() => {
            expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
        });
    });
*/
/*
    it('saves changes on outside click', () => {
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        const mockOnFinishEditRow = jest.fn();
        editableDateField.setProps({onFinishEditRow: mockOnFinishEditRow});
        editableDateField.find('td').simulate('click', event);
        expect(mockOnFinishEditRow).toBeCalled();
    });
*/
});
