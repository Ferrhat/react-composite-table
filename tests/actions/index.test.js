import {filterByLabel, filterByMultiSelectLabel, sorting} from '../../lib/actions/index';

describe('filterByLabel', () => {
    const data = [{'testProperty': 'testValue1'}, {'testProperty': 'testValue2'}];
    it('returns all rows if the filter is empty', () => {
        const result = filterByLabel(data, 'testProperty', '');
        expect(result).toEqual(data);
    });

    it('returns the filtered rows', () => {
        const result = filterByLabel(data, 'testProperty', 'testValue1');
        expect(result).toEqual([{'testProperty': 'testValue1'}]);
    });
});

describe('filterByMultiSelectLabel', () => {
    const data = [{'testProperty': 'testValue1'}, {'testProperty': 'testValue2'}];

    it('returns the filtered rows', () => {
        const result = filterByMultiSelectLabel(data, 'testProperty', [{label: 'testLabel', value: 'testValue1'}]);
        expect(result).toEqual([{'testProperty': 'testValue1'}]);
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
