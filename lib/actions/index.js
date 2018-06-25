import {isEmpty, get} from 'lodash';

export function filterByLabel(data, filterableProperty, filterValue) {
    return data.filter(row => {
            if (isEmpty(filterValue)) {
                return row;
            } else {
                const value = get(row, filterableProperty);
                return (value.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) ? row : null;
            }
        }
    )
}

export function filterByMultiSelectLabel(data, filterableProperty, filterValues) {
    return data.filter(row => {
        const value = get(row, filterableProperty);
        return filterValues.find(filterValue => filterValue.value == value);
    });
}

export function sorting(a, b, order, propertyName) {
    const firstValue = get(a, propertyName);
    const secondValue = get(b, propertyName);

    if (firstValue == secondValue) {
        return 0;
    } else if (firstValue < secondValue) {
        return order == 'ASC' ? -1 : 1;
    } else {
        return order == 'ASC' ? 1 : -1;
    }
}
