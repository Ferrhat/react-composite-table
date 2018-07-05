import React from 'react';
import {shallow, mount} from 'enzyme';
import EditableTextField from '../../../lib/factory/editableColumnFields/editableTextField';

describe('EditableTextField', () => {
    const mockOnChange = jest.fn();
    const mockOnClickEditRow = jest.fn();
    const editableTextField = shallow(<EditableTextField column={{ name: 'testName', value: 'testValue' }} onClickEditRow={mockOnClickEditRow} rowId={1} onUpdateField={() => Promise.resolve()} />);

    it('renders properly', () => {
        expect(editableTextField).toMatchSnapshot();
    });

    it('contains a td without input if the row is not under edit', () => {
        expect(editableTextField.find('td').length).toEqual(1);
        expect(editableTextField.find('input').length).toEqual(0);
    });

    it('should trigger a click event', () => {
        editableTextField.setProps({value: 'notTest'});
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        editableTextField.find('td').simulate('click', event);
        expect(editableTextField.state('currentValue')).toEqual('notTest');
        expect(mockOnClickEditRow).toBeCalledWith(1, 'testName');
    });

    it('contains a td and an input if the row is under edit', () => {
        editableTextField.setProps({rowUnderEdit: true, rowUnderEditId: 1, columnUnderEditId: 'testName' }, () => {
            expect(editableTextField.find('td').length).toEqual(1);
            expect(editableTextField.find('input').length).toEqual(1);
        });
    });

    it('should trigger a change event', () => {
        const mockFocus = jest.fn();
        const mockSetSelectionRange = jest.fn();
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue', focus: mockFocus, setSelectionRange: mockSetSelectionRange }
        };
        editableTextField.setState({currentValue: undefined});
        expect(editableTextField.state('currentValue')).toEqual(undefined);
        editableTextField.find('input').simulate('focus', event);
        editableTextField.find('input').simulate('change', event);
        editableTextField.find('input').simulate('blur');
        expect(mockFocus).toBeCalled();
        expect(mockSetSelectionRange).toBeCalledWith(event.target.value.length, event.target.value.length);
        expect(editableTextField.state('currentValue')).toEqual(event.target.value);
    });

    // Needs to be fixed: Not waiting for the async function to finish
    /*
    it('tries to save the changes and returns an error', () => {
        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const event = {
            key: 'Escape'
        };
        editableTextField.setState({currentValue: 'invalidValue', value: 'validValue' });
        editableTextField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: jest.fn() });
        expect(editableTextField.state('currentValue')).toEqual('invalidValue');
        editableTextField.find('input').simulate('keydown', event);
        expect(editableTextField.state('currentValue')).toEqual('validValue');
    });
    */

});
