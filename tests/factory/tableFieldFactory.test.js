import {shallow, mount} from 'enzyme';
import tableFieldFactory from '../../lib/factory/tableFieldFactory';

describe('tableFieldFactory', () => {

    it('returns a select component if type is select', () => {
        const result = tableFieldFactory.build({type: 'text'});
        expect(shallow(result).find('Select').length).toEqual(1);
    });

    it('returns undefined if type is unknown', () => {
        const result = tableFieldFactory.build({type: 'something'});
        expect(result).toEqual(undefined);
    });

});
