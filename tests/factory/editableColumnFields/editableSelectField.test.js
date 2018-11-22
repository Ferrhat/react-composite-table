import React from 'react';
import {shallow, mount} from 'enzyme';
import EditableSelectField from '../../../src/factory/editableColumnFields/editableSelectField';
import {flushPromises} from '../../helper/index';

describe('EditableSelectField', () => {
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
    let editableSelectField = shallow(
        <EditableSelectField
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
        expect(editableSelectField).toMatchSnapshot();
    });

    it('contains a td without Select if the row is not under edit', () => {
        expect(editableSelectField.find('td').length).toEqual(1);
        expect(editableSelectField.find('Select').length).toEqual(0);
    });

    it('changes to be editable on click', () => {
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        editableSelectField.find('td').simulate('click', event);
        expect(mockOnClickEditRow).toBeCalledWith(1, 'testName');
    });

    it('contains a td and an Select if the row is under edit', () => {
        editableSelectField.setProps({rowUnderEdit: true});
        expect(editableSelectField.find('td').length).toEqual(1);
        expect(editableSelectField.find('Select').length).toEqual(1);
    });

    it('loads default value', () => {
        editableSelectField.setState({currentValue: {value: 1, label: 'Hungary'}});
        editableSelectField.setProps({selectOptions: [{value: 1, label: 'Hungary'}], value: 1});
        editableSelectField.setProps({rowUnderEdit: false});

        expect(editableSelectField.find('Select').length).toEqual(0);
        expect(editableSelectField.find('td').text()).toEqual('Hungary');

        editableSelectField.setProps({rowUnderEdit: true});

        expect(editableSelectField.find('Select').length).toEqual(1);
        expect(editableSelectField.find('Select').prop('value')).toEqual({value: 1, label: 'Hungary'});
    });

    it('saves changes on blur with error', async () => {
        const getErrorsNow = jest.spyOn(editableSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select').simulate('change', 'newValue');
        editableSelectField.find('Select').simulate('blur');
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves changes on blur successfully', async () => {
        const getErrorsNow = jest.spyOn(editableSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select').simulate('change', {value: 1, label: 'Hungary'});
        editableSelectField.find('Select').simulate('blur');
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the changes on blur if the value is invalid`, async () => {
        const getErrorsNow = jest.spyOn(editableSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateField: mockOnUpdateField, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.setState({currentValue: ''});
        editableSelectField.find('Select').simulate('blur');
        await flushPromises();
        expect(mockOnFinishEditRow).not.toBeCalled();
        expect(mockHandleShowMessage).not.toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('stores new value on change', async () => {
        const getErrors = jest.spyOn(editableSelectField.instance(), 'getErrors');
        getErrors.mockClear();

        editableSelectField.setState({currentValue: '' });
        editableSelectField.find('Select').simulate('change', 'newValue');
        await flushPromises();
        expect(editableSelectField.state('currentValue')).toEqual('newValue');

        expect(getErrors).toHaveBeenCalledTimes(1);
    });


    it('saves row changes on enter with error', async () => {

        editableSelectField = mount(
            <EditableSelectField
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
        const getErrorsNow = jest.spyOn(editableSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        const mockOnUpdateRow = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select input').simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves row changes on enter successfully', async () => {
        const mockOnUpdateRow = jest.fn(() => Promise.resolve('saved'));
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField = mount(
            <EditableSelectField
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[{value: 1, label: 'Hungary'}]}
                value={1}
                onClickEditRow={mockOnClickEditRow}
                onChangeEditRow={mockOnChangeEditRow}
                rowId={1}
                rowUnderEdit={true}
                validateRow={mockValidateRow}
                onUpdateRow={mockOnUpdateRow}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
            />
        );
        const getErrorsNow = jest.spyOn(editableSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableSelectField.find('Select').simulate('change', {value: 1, label: 'Hungary'});
        editableSelectField.find('Select input').last().simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();

        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the row changes if the value is not changed`, async () => {
        editableSelectField = mount(
            <EditableSelectField
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

        const mockOnUpdateRow = jest.fn(() => Promise.resolve('canceled'));
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select input').simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).toBeCalled();

        expect(mockHandleShowMessage).not.toBeCalled();
    });

    it(`doesn't save the changes on enter if the value is invalid`, async () => {
        editableSelectField = mount(
            <EditableSelectField
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
        const getErrorsNow = jest.spyOn(editableSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableSelectField.setState({currentValue: ''});

        const mockOnUpdateRow = jest.fn(() => Promise.resolve('saved'));
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField.setProps({onUpdateRow: mockOnUpdateRow, handleShowMessage: mockHandleShowMessage, onFinishEditRow: mockOnFinishEditRow });
        editableSelectField.find('Select input').simulate('keydown', {key: 'Enter'});
        await flushPromises();
        expect(mockOnFinishEditRow).not.toBeCalled();

        expect(mockHandleShowMessage).not.toBeCalledWith('Selected row edited successfully', 'ok');
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves field changes on enter successfully', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField = mount(
            <EditableSelectField
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
        const getErrorsNow = jest.spyOn(editableSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableSelectField.instance().onChangeValue({value: 1, label: 'Hungary'});
        editableSelectField.find('Select input').last().simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableSelectField.state('value')).toEqual({value: 1, label: 'Hungary'});
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the field changes if the value is not changed`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableSelectField = mount(
            <EditableSelectField
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );

        editableSelectField.find('Select input').simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateField).not.toBeCalled();
        expect(mockOnFinishEditRow).toBeCalled();
        expect(mockHandleShowMessage).not.toBeCalled();
    });

    it(`doesn't save field changes on any button press`, async () => {

        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableSelectField = mount(
            <EditableSelectField
                column={{ name: 'testName', value: 'testValue' }}
                selectOptions={[]}
                rowId={1}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );

        editableSelectField.setState({currentValue: 'testing'});
        editableSelectField.find('Select input').simulate('keydown', {key: 'Any'});
        expect(mockOnUpdateField).not.toBeCalled();
    });

    it(`doesn't save changes on blur when editing row`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());

        editableSelectField = mount(
            <EditableSelectField
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
        const getErrorsNow = jest.spyOn(editableSelectField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableSelectField.find('Select input').simulate('blur');
        expect(mockOnUpdateField).not.toBeCalled();

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`displays a tooltip on a validation error`, () => {

        editableSelectField = shallow(
            <EditableSelectField
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

        editableSelectField.setState({
            errorMessage: 'There is an error!',
            isValid: false,
        });

        expect(editableSelectField.find('Tooltip').length).toEqual(1);
        expect(editableSelectField.find('Select').hasClass('invalid')).toEqual(true);
    });

    it('validates the value', () => {
        editableSelectField.setState({currentValue: ''});
        editableSelectField.instance().getErrors();

        expect(editableSelectField.state('errorMessage')).toEqual(` This field is required! `);
        expect(editableSelectField.state('isValid')).toEqual(false);
    });

});
