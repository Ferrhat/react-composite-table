import React from 'react';
import { shallow } from 'enzyme';
import CustomButtons from '../../lib/components/customButtons';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('CustomButtons',()=>{
    const mockButtonHandler = jest.fn();
    let button = shallow(<CustomButtons buttons={[
        {
            icon: { type: 'icon', name: 'edit' },
            handler: mockButtonHandler,
        },
        {
            renderer: () => <h1>{'testH1'}</h1>,
        }
    ]} row={{id: 1}} />);

    it('renders properly', () => {
        expect(button).toMatchSnapshot();
    });

    it('calls the onclick function', () => {
        button = shallow(<CustomButtons buttons={[
            {
                icon: { type: 'icon', name: 'edit' },
                handler: mockButtonHandler,
            },
            {
                renderer: () => <h1>{'testH1'}</h1>,
            }
        ]} row={{id: 1}} />);
        expect(button.find('li > span.icon-edit').length).toEqual(1);
        button.find('li > span.icon-edit').simulate('click');
        expect(mockButtonHandler).toBeCalled();
        expect(button.find('li > h1').length).toEqual(1);
        expect(button.find('li > h1').text()).toEqual('testH1');
    });
});
