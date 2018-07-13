import React from 'react';
import {shallow, mount} from 'enzyme';
import TextField from "../../../lib/factory/filterFields/textField";

describe('TextField', () => {
    const mockOnChange = jest.fn();
    const textField = shallow(<TextField onChange={mockOnChange} filterableProperty={'testValue'} name={'testName'} />);

    it('renders properly', () => {
        expect(textField).toMatchSnapshot();
    });

    it('contains an input component', () => {
        expect(textField.find('input').length).toEqual(1);
    });

    it('stores the changed value', () => {
        textField.setProps({value: 'newValue'});
        expect(textField.state('value')).toEqual('newValue');
    });

    it('should trigger a change event', () => {
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        textField.find('input').simulate('change', event);
        expect(mockOnChange).toBeCalledWith('testName', 'text', 'testValue', event.target.value);
        expect(textField.state('value')).toEqual(event.target.value);
    });

});
