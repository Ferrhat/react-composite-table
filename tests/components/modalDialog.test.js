import React from 'react';
import {shallow} from 'enzyme';
import ModalDialog from '../../lib/components/modalDialog';

describe('ModalDialog', () => {
    const modalDialog = shallow(<ModalDialog showDialog={true} />);

    it('renders properly', () => {
        expect(modalDialog).toMatchSnapshot();
    });

    it('hides the message on click', () => {
        expect(modalDialog.state('show')).toEqual(true);
        modalDialog.find('Button').simulate('click');
        expect(modalDialog.state('show')).toEqual(false);
    });

});
