import React from 'react';
import {shallow, mount} from 'enzyme';
import TextField from "../../../lib/factory/fields/textField";

describe('TextField', () => {
    const mockOnChange = jest.fn();
    const textField = shallow(<TextField onChange={mockOnChange} filterableProperty={'testValue'} />);

    it('renders properly', () => {
        expect(textField).toMatchSnapshot();
    });

    it('contains an input component', () => {
        expect(textField.find('input').length).toEqual(1);
    });

    it('should trigger a change event', () => {
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        textField.find('input').simulate('change', event);
        expect(mockOnChange).toBeCalledWith('testValue', event);
        expect(textField.state('value')).toEqual(event.target.value);
    });

});
