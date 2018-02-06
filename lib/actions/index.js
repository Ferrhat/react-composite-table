import {isEmpty} from 'lodash';

export function filterByLabel(data, filterableProperty, filterValue) {
    return data.filter(row => {
            if (isEmpty(filterValue)) {
                return row;
            } else {
                const value = getValueFromObjectPropertyByName(row, filterableProperty);
                return (value.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) ? row : null;
            }
        }
    )
}

export function filterByMultiSelectLabel(data, filterableProperty, filterValues) {
    return data.filter(row => {
        let isRowMatchToFilterValue = false;
        const value = getValueFromObjectPropertyByName(row, filterableProperty);

        filterValues.map(filterValue => {
            if (isEmpty(filterValue.label)) {
                isRowMatchToFilterValue = true;
            }
            if (value.toLowerCase().indexOf(filterValue.label.toLowerCase()) >= 0) {
                isRowMatchToFilterValue = true;
            }
        });

        return isRowMatchToFilterValue ? row : null;
    });
}

export function sorting(a, b, order, propertyName) {
    const firstValue = getValueFromObjectPropertyByName(a, propertyName);
    const secondValue = getValueFromObjectPropertyByName(b, propertyName);

    if (firstValue == secondValue) {
        return 0;
    } else if (firstValue < secondValue) {
        return order == 'ASC' ? -1 : 1;
    } else {
        return order == 'ASC' ? 1 : -1;
    }
}

export function getValueFromObjectPropertyByName(data, propertyName) {
    const properties = propertyName.split('.');
    let rowToIterateThrow = data;
    let value = null;
    properties.map(data => {
        let {[data]: nextLevelOfData} = rowToIterateThrow;
        rowToIterateThrow = nextLevelOfData
        value = nextLevelOfData
    })
    return value;
}