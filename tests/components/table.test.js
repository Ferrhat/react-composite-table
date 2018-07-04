import React from 'react';
import {shallow} from 'enzyme';
import Table from '../../lib/components/table';

describe('Table', () => {
    const table = shallow(<Table columns={[]} data={[]} />);

    it('renders properly', () => {
        expect(table).toMatchSnapshot();
    });

    it('contains a message component', () => {
        expect(table.find('Message').length).toEqual(0);
        table.setState({isMessageActive: true});
        table.update();
        expect(table.find('Message').length).toEqual(1);
    });

    it('hides the message on click', () => {
        expect(table.state('isMessageActive')).toEqual(true);
        table.find('Message').simulate('click');
        expect(table.state('isMessageActive')).toEqual(false);
    });

});
