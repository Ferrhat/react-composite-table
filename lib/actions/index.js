import {isEmpty, get, escapeRegExp} from 'lodash';

export function filterByLabel(data, filterableProperty, filterValue) {
    return data.filter(row => {
            const value = get(row, filterableProperty);
            return Boolean(value.match(RegExp(escapeRegExp(filterValue), 'i')));
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

export function validateField(validators, value) {
    const validationErrors = validators.filter(validator => {
        const validationError = !validator.rule(value);
        return validationError;
    });
    return validationErrors;
}
