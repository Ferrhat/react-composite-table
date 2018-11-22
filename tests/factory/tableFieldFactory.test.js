import {get} from 'lodash';
import tableFieldFactory from '../../src/factory/tableFieldFactory';

describe('tableFieldFactory', () => {

    it('returns an EditableTextField component if type is text', () => {
        const result = tableFieldFactory.build({type: 'text', column: {value: ''}});
        expect(get(result, 'type.name', '')).toEqual('EditableTextField');
    });

    it('returns an EditableSelectField component if type is select', () => {
        const result = tableFieldFactory.build({type: 'select', column: {value: ''}});
        expect(get(result, 'type.name', '')).toEqual('EditableSelectField');
    });

    it('returns an EditableMultiSelectField component if type is multiselect', () => {
        const result = tableFieldFactory.build({type: 'multiselect', column: {value: ''}});
        expect(get(result, 'type.name', '')).toEqual('EditableMultiSelectField');
    });

    it('returns an EditableDateField component if type is date', () => {
        const result = tableFieldFactory.build({type: 'date', column: {value: ''}});
        expect(get(result, 'type.name', '')).toEqual('EditableDateField');
    });

    it('returns undefined if type is unknown', () => {
        const result = tableFieldFactory.build({type: 'something', column: {value: ''}});
        expect(get(result, 'type.name', '')).toEqual('');
    });

});
