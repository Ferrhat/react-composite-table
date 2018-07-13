import React from 'react';
import {shallow} from 'enzyme';
import SelectField from "../../../lib/factory/filterFields/selectField";


describe('SelectField', () => {
    const mockOnChange = jest.fn();
    const selectField = shallow(<SelectField onChange={mockOnChange} options={[]} name={'testName'} filterableProperty={'testValue'} />);

    it('renders properly', () => {
        expect(selectField).toMatchSnapshot();
    });

    it('contains a connected Select component', () => {
        expect(selectField.find('Select').length).toEqual(1);
    });

    it('stores the changed value', () => {
        selectField.setProps({value: 'newValue'});
        expect(selectField.state('value')).toEqual('newValue');
    });

    it('should trigger a change event', () => {
        const selection = {
            value: 'testValue',
        };
        selectField.find('Select').simulate('change', selection);
        expect(mockOnChange).toBeCalledWith('testName', 'multiSelect', 'testValue', selection);
    });
});
