import React from 'react';
import { mount } from 'enzyme';
import Message from '../../lib/components/message';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Message',()=>{
    let container;

    beforeEach(()=>{
        container = mount(<Message content={'Hello'} />);
    });

    it('renders the Message component', () => {
        expect(container.length).toEqual(1);
        expect(container.find('Alert').length).toEqual(1);
        expect(container.find('Alert').text()).toEqual('Hello');
    });

    it('displays an error icon', () => {
        container.setProps({ level: 'error' }, () => {
            expect(container.find('span').length).toEqual(1);
            expect(container.find('span').hasClass('icon-error')).toEqual(true);
        });
    });

    it('displays an info icon', () => {
        container.setProps({ level: 'info' }, () => {
            expect(container.find('span').length).toEqual(1);
            expect(container.find('span').hasClass('icon-info')).toEqual(true);
        });
    });

    it('displays an ok icon', () => {
        container.setProps({ level: 'ok' }, () => {
            expect(container.find('span').length).toEqual(1);
            expect(container.find('span').hasClass('icon-ok')).toEqual(true);
        });
    });

    it('displays a warning icon', () => {
        container.setProps({ level: 'warning' }, () => {
            expect(container.find('span').length).toEqual(1);
            expect(container.find('span').hasClass('icon-warning')).toEqual(true);
        });
    });
});
