import React from 'react';
import {shallow, mount} from 'enzyme';
import EditableMultiSelectField from '../../../lib/factory/editableColumnFields/editableMultiSelectField';
import {flushPromises} from '../../helper/index';

describe('EditableMultiSelectField', () => {
    const lodash = require('lodash');

    jest.spyOn(lodash, 'debounce').mockImplementation((f) => {
        return f;
    });

    const requiredField = () => ({
        name: 'requiredField',
        rule: (value) => lodash.isArray(value) && value.length > 0,
        message: ` This field is required! `
    });

    const validators = [
        requiredField(),
    ];

    const mockValidateRow = jest.fn();
    const mockOnChangeEditRow = jest.fn();
    const mockOnClickEditRow = jest.fn();
    let editableMultiSelectField = shallow(
        <EditableMultiSelectField
            value={[]}
            column={{ name: 'testName', value: 'testValue' }}
            selectOptions={[]}
            validateRow={mockValidateRow}
            onClickEditRow={mockOnClickEditRow}
            onChangeEditRow={mockOnChangeEditRow}
            rowId={1}
            onUpdateField={() => Promise.resolve()}
            validators={validators}
        />
    );

    it('renders properly', () => {
        expect(editableMultiSelectField).toMatchSnapshot();
    });

    it('contains a td without Select if the row is not under edit', () => {
        expect(editableMultiSelectField.find('td').length).toEqual(1);
        expect(editableMultiSelectField.find('Select').length).toEqual(0);
    });

    it('changes to be editable on click', () => {
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        editableMultiSelectField.find('td').simulate('click', event);
        expect(mockOnClickEditRow).toBeCalledWith(1, 'testName');
    });

    it('contains a td and an Select if the row is under edit', () => {
        editableMultiSelectField.setProps({rowUnderEdit: true});
        expect(editableMultiSelectField.find('td').length).toEqual(1);
        expect(editableMultiSelectField.find('Select').length).toEqual(1);
    });

    it('loads default value', () => {
        editableMultiSelectField.setState({currentValue: [{value: 1, label: 'Hungary'}]});
        editableMultiSelectField.setProps({selectOptions: [{value: 1, label: 'Hungary'}], value: [{value: 1, label: 'Hungary'}]});
        editableMultiSelectField.setProps({rowUnderEdit: false});

        expect(editableMultiSelectField.find('Select').length).toEqual(0);
        expect(editableMultiSelectField.find('td').text()).toEqual('Hungary');

        editableMultiSelectField.setProps({rowUnderEdit: true});

        expect(editableMultiSelectField.find('Select').length).toEqual(1);
        expect(editableMultiSelectField.find('Select').prop('value')).toEqual([{value: 1, label: 'Hungary'}]);
    });

    it('saves changes on blur with error', async () => {
        const getErrorsNow = jest.spyOn(editableMultiSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableMultiSelectField.find('Select').simulate('change', [{value: 1, label: 'Hungary'}]);
        editableMultiSelectField.find('Select').simulate('blur');
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves changes on blur successfully', async () => {
        const getErrorsNow = jest.spyOn(editableMultiSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableMultiSelectField.find('Select').simulate('change', [{value: 1, label: 'Hungary'}]);
        editableMultiSelectField.find('Select').simulate('blur');
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the changes on blur if the value is invalid`, async () => {
        const getErrorsNow = jest.spyOn(editableMultiSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableMultiSelectField.setState({currentValue: []});
        editableMultiSelectField.find('Select').simulate('blur');
        await flushPromises();
        expect(mockOnFinishEditRow).not.toBeCalled();
        expect(mockHandleShowMessage).not.toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('stores new value on change', async () => {
        const getErrors = jest.spyOn(editableMultiSelectField.instance(), 'getErrors');
        getErrors.mockClear();

        editableMultiSelectField.setState({currentValue: []});
        editableMultiSelectField.find('Select').simulate('change', [{value: 1, label: 'Hungary'}]);
        await flushPromises();
        expect(editableMultiSelectField.state('currentValue')).toEqual([{value: 1, label: 'Hungary'}]);

        expect(getErrors).toHaveBeenCalledTimes(1);
    });


    it('saves row changes on enter with error', async () => {

        editableMultiSelectField = mount(
            <EditableMultiSelectField
                value={[{value: 1, label: 'Hungary'}]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[{value: 1, label: 'Hungary'}]}
                onClickEditRow={mockOnClickEditRow}
                onChangeEditRow={mockOnChangeEditRow}
                rowId={1}
                onUpdateField={() => Promise.resolve()}
                rowUnderEdit={true}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableMultiSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateRow = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableMultiSelectField.find('Select input').last().simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves row changes on enter successfully', async () => {
        editableMultiSelectField = mount(
            <EditableMultiSelectField
                value={[{value: 1, label: 'Hungary'}]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[{value: 1, label: 'Hungary'}]}
                onClickEditRow={mockOnClickEditRow}
                onChangeEditRow={mockOnChangeEditRow}
                rowId={1}
                onUpdateField={() => Promise.resolve()}
                rowUnderEdit={true}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableMultiSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateRow = jest.fn(() => Promise.resolve('saved'));
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableMultiSelectField.find('Select input').last().simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();

        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the row changes if the value is not changed`, async () => {
        editableMultiSelectField = mount(
            <EditableMultiSelectField
                value={[{value: 1, label: 'Hungary'}]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[{value: 1, label: 'Hungary'}]}
                onClickEditRow={mockOnClickEditRow}
                onChangeEditRow={mockOnChangeEditRow}
                rowId={1}
                onUpdateField={() => Promise.resolve()}
                rowUnderEdit={true}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );

        const mockOnUpdateRow = jest.fn(() => Promise.resolve('canceled'));
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableMultiSelectField.find('Select input').last().simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();

        expect(mockHandleShowMessage).not.toBeCalled();
    });

    it(`doesn't save the changes on enter if the value is invalid`, async () => {
        editableMultiSelectField = mount(
            <EditableMultiSelectField
                value={[]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                onClickEditRow={mockOnClickEditRow}
                onChangeEditRow={mockOnChangeEditRow}
                rowId={1}
                onUpdateField={() => Promise.resolve()}
                rowUnderEdit={true}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableMultiSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableMultiSelectField.setState({currentValue: []});

        const mockOnUpdateRow = jest.fn(() => Promise.resolve('saved'));
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableMultiSelectField.find('Select input').simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).not.toBeCalled();

        expect(mockHandleShowMessage).not.toBeCalledWith('Selected row edited successfully', 'ok');
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves field changes on enter successfully', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField = mount(
            <EditableMultiSelectField
                value={[{value: 1, label: 'Hungary'}]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[{value: 1, label: 'Hungary'}]}
                onChangeEditRow={mockOnChangeEditRow}
                rowId={1}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableMultiSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableMultiSelectField.setState({currentValue: [{value: 1, label: 'Hungary'}]});
        editableMultiSelectField.instance().onChangeValue([{value: 1, label: 'Hungary'}]);
        editableMultiSelectField.find('Select input').last().simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableMultiSelectField.state('value')).toEqual([{value: 1, label: 'Hungary'}]);
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the field changes if the value is not changed`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableMultiSelectField = mount(
            <EditableMultiSelectField
                value={[{value: 1, label: 'Hungary'}]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[{value: 1, label: 'Hungary'}]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );

        editableMultiSelectField.find('Select input').last().simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateField).not.toBeCalled();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).not.toBeCalled();
    });

    it(`doesn't save field changes on any button press`, async () => {

        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableMultiSelectField = mount(
            <EditableMultiSelectField
                value={[]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );

        editableMultiSelectField.setState({currentValue: 'testing'});
        editableMultiSelectField.find('Select input').simulate('keydown', {key: 'Any'});
        expect(mockOnUpdateField).not.toBeCalled();
    });

    it(`doesn't save changes on blur when editing row`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableMultiSelectField = mount(
            <EditableMultiSelectField
                value={[]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateRow={() => jest.fn()}
                onUpdateField={mockOnUpdateField}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableMultiSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableMultiSelectField.find('Select input').simulate('blur');
        expect(mockOnUpdateField).not.toBeCalled();

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`displays a tooltip on a validation error`, () => {

        editableMultiSelectField = shallow(
            <EditableMultiSelectField
                value={[]}
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateField={() => jest.fn()}
                validateRow={mockValidateRow}
                invalidClassName={'invalid'}
                validators={validators}
            />
        );

        editableMultiSelectField.setState({
            errorMessage: 'There is an error!',
            isValid: false,
        });

        expect(editableMultiSelectField.find('Tooltip').length).toEqual(1);
        expect(editableMultiSelectField.find('Select').hasClass('invalid')).toEqual(true);
    });

    it('validates the value', () => {
        editableMultiSelectField.setState({currentValue: []});
        editableMultiSelectField.instance().getErrors();

        expect(editableMultiSelectField.state('errorMessage')).toEqual(` This field is required! `);
        expect(editableMultiSelectField.state('isValid')).toEqual(false);
    });

});
