import {isEmpty, get, escapeRegExp, isArray, intersectionBy, defaultTo} from 'lodash';

export function filterByLabel(data, filterableProperty, filterValue) {
    return data.filter(row => {
        let value = defaultTo(get(row, filterableProperty), '');
            if (isArray(value)) {
                value = value.map(arrayItem => arrayItem.label).join(', ');
            }
            return Boolean(value.match(RegExp(escapeRegExp(filterValue), 'i')));
        }
    )
}

export function filterByMultiSelectLabel(data, filterableProperty, filterValues) {
    return data.filter(row => {
        let value = get(row, filterableProperty);
        const allFilterValues = isArray(filterValues) ? filterValues : [filterValues];
        if (isArray(value)) {
            return intersectionBy(allFilterValues, value, 'value').length;
        }
        return allFilterValues.find(filterValue => filterValue.value == value);
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
