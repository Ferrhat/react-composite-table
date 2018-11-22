import React from 'react';
import { mount } from 'enzyme';
import TableButton from '../../src/components/tableButton';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('TableButton',()=>{
    const mockOnClick = jest.fn();
    const button = shallow(<TableButton className='icon icon-delete' onClick={mockOnClick} />);

    it('renders properly', () => {
        expect(button).toMatchSnapshot();
    });

    it('calls the onclick function', () => {
        expect(button.find('.list-inline-item > span').length).toEqual(1);
        button.find('.list-inline-item > span').simulate('click');

        expect(mockOnClick).toBeCalled();
    });
});
