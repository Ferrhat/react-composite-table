import React from 'react';
import {shallow, mount} from 'enzyme';
import EditableSelectField from '../../../lib/factory/editableColumnFields/editableSelectField';

describe('EditableSelectField', () => {
    const mockOnClickEditRow = jest.fn();
    const editableSelectField = shallow(<EditableSelectField column={{ name: 'testName', value: 'testValue' }} selectOptions={[]} onClickEditRow={mockOnClickEditRow} rowId={1} onUpdateField={() => Promise.resolve()} />);

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
        editableSelectField.setProps({rowUnderEdit: true, rowUnderEditId: 1, columnUnderEditId: 'testName' });
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

    it('saves changes on blur with error', (done) => {
        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select').simulate('blur');
        setImmediate(() => {
            expect(mockOnFinishEditRow).toBeCalled();
            expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');
            done();
        });
    });

    it('saves changes on blur successfully', (done) => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select').simulate('blur');
        setImmediate(() => {
            expect(mockOnFinishEditRow).toBeCalled();
            expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
            done();
        });
    });

    it('stores new value on change', (done) => {
        editableSelectField.setState({currentValue: '' });
        editableSelectField.find('Select').simulate('change', 'newValue');
        setImmediate(() => {
            expect(editableSelectField.state('currentValue')).toEqual('newValue');
            done();
        });
    });

});
