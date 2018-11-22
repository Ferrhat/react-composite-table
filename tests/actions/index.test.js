import {filterByLabel, filterByMultiSelectLabel, sorting, validateField} from '../../src/actions/index';

describe('filterByLabel', () => {
    const data = [{'testProperty': 'testValue1'}, {'testProperty': 'testValue2'}];
    const multiSelectData = [
        {'testProperty': [{value: 1, label: 'testLabel1'}, {value: 2, label: 'testLabel2'}]},
        {'testProperty': [{value: 1, label: 'testLabel1'}]},
    ];

    it('returns all rows if the filter is empty', () => {
        const result = filterByLabel(data, 'testProperty', '');
        expect(result).toEqual(data);
    });

    it('returns the filtered rows of editable text/select', () => {
        const result = filterByLabel(data, 'testProperty', 'testValue1');
        expect(result).toEqual([{'testProperty': 'testValue1'}]);
    });

    it('returns the filtered rows of editable multi select', () => {
        const result = filterByLabel(multiSelectData, 'testProperty', 'testLabel2');
        expect(result).toEqual([{'testProperty': [{value: 1, label: 'testLabel1'}, {value: 2, label: 'testLabel2'}]}]);
    });
});

describe('filterByMultiSelectLabel', () => {
    const data = [{'testProperty': 'testValue1'}, {'testProperty': 'testValue2'}];
    const multiSelectData = [
        {'testProperty': [{value: 1, label: 'testLabel1'}, {value: 2, label: 'testLabel2'}]},
        {'testProperty': [{value: 1, label: 'testLabel1'}]},
    ];

    it('returns the filtered rows of editable text/select', () => {
        const result = filterByMultiSelectLabel(data, 'testProperty', [{label: 'testLabel', value: 'testValue1'}]);
        expect(result).toEqual([{'testProperty': 'testValue1'}]);
    });

    it('returns the filtered rows of editable multi select', () => {
        const result = filterByMultiSelectLabel(multiSelectData, 'testProperty', [{value: 2, label: 'testLabel2'}]);
        expect(result).toEqual([{'testProperty': [{value: 1, label: 'testLabel1'}, {value: 2, label: 'testLabel2'}]}]);
    });
});

describe('sorting', () => {
    const data = [{'testProperty': 'testValue1'}, {'testProperty': 'testValue2'}];

    it('returns 0 if the values are equal', () => {
        const result = sorting(data[0], data[0], 'ASC', 'testProperty');
        expect(result).toEqual(0);
    });

    it('returns -1 if the first value is lower than the second value in ascending order', () => {
        const result = sorting(data[0], data[1], 'ASC', 'testProperty');
        expect(result).toEqual(-1);
    });

    it('returns 1 if the first value is lower than the second value in descending order', () => {
        const result = sorting(data[0], data[1], 'DESC', 'testProperty');
        expect(result).toEqual(1);
    });

    it('returns 1 if the first value is greater than the second value in ascending order', () => {
        const result = sorting(data[1], data[0], 'ASC', 'testProperty');
        expect(result).toEqual(1);
    });

    it('returns -1 if the first value is greater than the second value in descending order', () => {
        const result = sorting(data[1], data[0], 'DESC', 'testProperty');
        expect(result).toEqual(-1);
    });
});

describe('validateField', () => {

    const requiredField = () => ({
        name: 'requiredField',
        rule: (value) => value !== '',
        message: ` This field is required! `
    });

    const validators = [
        requiredField(),
    ];

    it('returns array of failed validators if the value is invalid', () => {
        const result = validateField(validators, '');
        expect(result).toEqual(validators);
    });

    it('returns empty array if the value is valid', () => {
        const result = validateField(validators, 'validValue');
        expect(result).toEqual([]);
    });

});
