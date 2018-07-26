import React from 'react';
import {shallow, mount} from 'enzyme';
import EditableTextField from '../../../lib/factory/editableColumnFields/editableTextField';
import {flushPromises} from '../../helper/index';

describe('EditableTextField', () => {
    const lodash = require('lodash');

    jest.spyOn(lodash, 'debounce').mockImplementation((f) => {
        return f;
    });

    const requiredField = () => ({
        name: 'requiredField',
        rule: (value) => value !== '',
        message: ` This field is required! `
    });

    const validators = [
        requiredField(),
    ];

    const mockValidateRow = jest.fn();
    const mockOnChangeEditRow = jest.fn();
    const mockOnClickEditRow = jest.fn();
    const editableTextField = shallow(
        <EditableTextField
            column={{ name: 'testName', value: 'testValue' }}
            onClickEditRow={mockOnClickEditRow}
            onChangeEditRow={mockOnChangeEditRow}
            rowId={1}
            onUpdateField={() => Promise.resolve()}
            validateRow={mockValidateRow}
            validators={validators}
        />
    );

    it('renders properly', () => {
        expect(editableTextField).toMatchSnapshot();
    });

    it('contains a td without input if the row is not under edit', () => {
        expect(editableTextField.find('td').length).toEqual(1);
        expect(editableTextField.find('input').length).toEqual(0);
    });

    it('should trigger a click event', () => {
        editableTextField.setProps({value: 'notTest', onFinishEditRow: jest.fn(), handleShowMessage: jest.fn()});
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        editableTextField.find('td').simulate('click', event);
        expect(editableTextField.state('currentValue')).toEqual('notTest');
        expect(mockOnClickEditRow).toBeCalledWith(1, 'testName');
    });

    it('contains a td and an input if the row is under edit', () => {
        editableTextField.setProps({rowUnderEdit: true});
        expect(editableTextField.find('td').length).toEqual(1);
        expect(editableTextField.find('input').length).toEqual(1);
    });

    it('should trigger a change event', () => {
        const getErrorsNow = jest.spyOn(editableTextField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();
        const getErrors = jest.spyOn(editableTextField.instance(), 'getErrors');
        getErrors.mockClear();

        const mockFocus = jest.fn();
        const mockSetSelectionRange = jest.fn();
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue', focus: mockFocus, setSelectionRange: mockSetSelectionRange }
        };
        editableTextField.setState({currentValue: undefined});
        expect(editableTextField.state('currentValue')).toEqual(undefined);
        editableTextField.find('input').simulate('focus', event);
        editableTextField.find('input').simulate('change', event);
        editableTextField.find('input').simulate('blur');
        expect(mockFocus).toBeCalled();
        expect(mockSetSelectionRange).toBeCalledWith(event.target.value.length, event.target.value.length);
        expect(mockOnChangeEditRow).toBeCalledWith(event.target.value);
        expect(editableTextField.state('currentValue')).toEqual(event.target.value);
        expect(getErrors).toHaveBeenCalledTimes(1);
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves the field changes successfully', async () => {
        const getErrorsNow = jest.spyOn(editableTextField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();
        const getErrors = jest.spyOn(editableTextField.instance(), 'getErrors');
        getErrors.mockClear();

        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockOnFinishEditRow = jest.fn();
        const mockHandleShowMessage = jest.fn();

        editableTextField.setProps({
            onUpdateRow: null,
            rowUnderEdit: true,
            onUpdateField: mockOnUpdateField,
            handleShowMessage: mockHandleShowMessage,
            onFinishEditRow: mockOnFinishEditRow,
        });
        expect(editableTextField.find('input').length).toEqual(1);
        editableTextField.find('input').simulate('change', {target: {value: 'testValue'}});
        await flushPromises();
        expect(editableTextField.state('currentValue')).toEqual('testValue');
        editableTextField.find('input').simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(editableTextField.state('value')).toEqual('testValue');
        expect(mockOnUpdateField).toBeCalled();
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrors).toHaveBeenCalledTimes(1);
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('displays an error if the field changes cannot be saved', async () => {
        const getErrorsNow = jest.spyOn(editableTextField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();
        const getErrors = jest.spyOn(editableTextField.instance(), 'getErrors');
        getErrors.mockClear();

        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockOnFinishEditRow = jest.fn();
        const mockHandleShowMessage = jest.fn();

        editableTextField.setProps({
            onUpdateRow: null,
            rowUnderEdit: true,
            value: 'previousValue',
            onUpdateField: mockOnUpdateField,
            handleShowMessage: mockHandleShowMessage,
            onFinishEditRow: mockOnFinishEditRow,
        });
        expect(editableTextField.find('input').length).toEqual(1);
        editableTextField.find('input').simulate('change', {target: {value: 'testValue'}});
        await flushPromises();
        expect(editableTextField.state('currentValue')).toEqual('testValue');
        editableTextField.find('input').simulate('keydown', {key: 'Escape'});
        await flushPromises();

        expect(editableTextField.state('currentValue')).toEqual('previousValue');
        expect(mockOnUpdateField).toBeCalled();
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrors).toHaveBeenCalledTimes(1);
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the changes on any button press`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableTextField.setProps({
            onUpdateRow: null,
            rowUnderEdit: true,
            onUpdateField: mockOnUpdateField,
        });

        editableTextField.find('input').simulate('keydown', {key: 'Any'});
        await flushPromises();
        expect(mockOnUpdateField).not.toBeCalled();
    });

    it(`doesn't save the changes on enter if the value is invalid`, async () => {
        const getErrorsNow = jest.spyOn(editableTextField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();
        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableTextField.setProps({
            onUpdateRow: null,
            rowUnderEdit: true,
            onUpdateField: mockOnUpdateField,
        });

        editableTextField.setState({currentValue: ''});

        editableTextField.find('input').simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnUpdateField).not.toBeCalled();
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the changes on blur when editing row`, async () => {
        const getErrorsNow = jest.spyOn(editableTextField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockOnUpdateRow = jest.fn(() => Promise.resolve());

        editableTextField.setProps({
            onUpdateRow: mockOnUpdateRow,
            rowUnderEdit: true,
            onUpdateField: mockOnUpdateField,
        });

        editableTextField.find('input').simulate('blur');
        await flushPromises();
        expect(mockOnUpdateField).not.toBeCalled();
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the changes on blur when the value is invalid`, async () => {
        const getErrorsNow = jest.spyOn(editableTextField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();
        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableTextField.setProps({
            onUpdateRow: null,
            rowUnderEdit: true,
            onUpdateField: mockOnUpdateField,
        });

        editableTextField.setState({currentValue: ''});

        editableTextField.find('input').simulate('blur');
        await flushPromises();

        expect(mockOnUpdateField).not.toBeCalled();
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves the row changes successfully', async () => {
        const getErrorsNow = jest.spyOn(editableTextField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();
        const getErrors = jest.spyOn(editableTextField.instance(), 'getErrors');
        getErrors.mockClear();

        const mockOnUpdateRow = jest.fn(() => Promise.resolve());
        const mockOnFinishEditRow = jest.fn();
        const mockHandleShowMessage = jest.fn();

        editableTextField.setProps({
            rowUnderEdit: true,
            onUpdateRow: mockOnUpdateRow,
            handleShowMessage: mockHandleShowMessage,
            onFinishEditRow: mockOnFinishEditRow,
        });
        expect(editableTextField.find('input').length).toEqual(1);
        editableTextField.find('input').simulate('change', {target: {value: 'testValue'}});
        await flushPromises();
        expect(editableTextField.state('currentValue')).toEqual('testValue');
        editableTextField.find('input').simulate('keydown', {key: 'Enter'});
        await flushPromises();

        expect(editableTextField.state('value')).toEqual('testValue');
        expect(mockOnUpdateRow).toBeCalled();
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrors).toHaveBeenCalledTimes(1);
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('displays an error if the row changes cannot be saved', async () => {
        const getErrorsNow = jest.spyOn(editableTextField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();
        const getErrors = jest.spyOn(editableTextField.instance(), 'getErrors');
        getErrors.mockClear();

        const mockOnUpdateRow = jest.fn(() => Promise.reject());
        const mockOnFinishEditRow = jest.fn();
        const mockHandleShowMessage = jest.fn();

        editableTextField.setProps({
            rowUnderEdit: true,
            value: 'previousValue',
            onUpdateRow: mockOnUpdateRow,
            handleShowMessage: mockHandleShowMessage,
            onFinishEditRow: mockOnFinishEditRow,
        });
        expect(editableTextField.find('input').length).toEqual(1);
        editableTextField.find('input').simulate('change', {target: {value: 'testValue'}});
        await flushPromises();
        expect(editableTextField.state('currentValue')).toEqual('testValue');
        editableTextField.find('input').simulate('keydown', {key: 'Escape'});
        await flushPromises();

        expect(editableTextField.state('currentValue')).toEqual('previousValue');
        expect(mockOnUpdateRow).toBeCalled();
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrors).toHaveBeenCalledTimes(1);
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('displays a tooltip on a validation error', () => {
        const mockOnUpdateRow = jest.fn(() => Promise.reject());
        const mockOnFinishEditRow = jest.fn();
        const mockHandleShowMessage = jest.fn();

        editableTextField.setProps({
            rowUnderEdit: true,
            value: 'previousValue',
            onUpdateRow: mockOnUpdateRow,
            handleShowMessage: mockHandleShowMessage,
            onFinishEditRow: mockOnFinishEditRow,
            invalidClassName: 'invalid',
        });
        editableTextField.setState({
            errorMessage: 'There is an error!',
            isValid: false,
        });

        expect(editableTextField.find('Tooltip').length).toEqual(1);
        expect(editableTextField.find('input').hasClass('invalid')).toEqual(true);
    });

    it('validates the value', () => {
        editableTextField.setState({currentValue: ''});
        editableTextField.instance().getErrors();

        expect(editableTextField.state('errorMessage')).toEqual(` This field is required! `);
        expect(editableTextField.state('isValid')).toEqual(false);
    });

});
