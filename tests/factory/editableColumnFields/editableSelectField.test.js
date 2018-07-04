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

    it('contains a td and an Select if the row is under edit', () => {
        editableSelectField.setProps({rowUnderEdit: true, rowUnderEditId: 1, columnUnderEditId: 'testName' }, () => {
            expect(editableSelectField.find('td').length).toEqual(1);
            expect(editableSelectField.find('Select').length).toEqual(1);
        });
    });

});
