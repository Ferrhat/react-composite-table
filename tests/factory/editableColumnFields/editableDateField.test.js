import React from 'react';
import {shallow, mount} from 'enzyme';
import moment from 'moment';
import EditableDateField from '../../../lib/factory/editableColumnFields/editableDateField';
import {flushPromises} from '../../helper/index';

describe('EditableDateField', () => {
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
    const mockOnClickEditRow = jest.fn();
    let editableDateField = mount(
        <EditableDateField
            column={{ name: 'testName', value: 'testValue' }}
            onClickEditRow={mockOnClickEditRow}
            validateRow={mockValidateRow}
            rowId={1}
            onUpdateField={() => Promise.resolve()}
            validators={validators}
        />
    );

    it('renders properly', () => {
        expect(editableDateField).toMatchSnapshot();
    });

    it('contains a td without DatePicker if the row is not under edit', () => {
        expect(editableDateField.find('td').length).toEqual(1);
        expect(editableDateField.find('DatePicker').length).toEqual(0);
    });

    it('changes to be editable on click', () => {
        const event = {
            preventDefault() {},
            target: { name: 'testName', value: 'testValue' }
        };
        editableDateField.find('td').simulate('click', event);
        expect(mockOnClickEditRow).toBeCalledWith(1, 'testName');
    });

    it('contains a td and an DatePicker if the row is under edit', () => {
        editableDateField.setProps({rowUnderEdit: true});
        expect(editableDateField.find('td').length).toEqual(1);
        expect(editableDateField.find('DatePicker').length).toEqual(1);
    });

    it('saves changes on change', async () => {
        const mockOnChangeEditRow = jest.fn();
        editableDateField.setState({currentValue: '2018-01-01'});

        editableDateField.setProps({onChangeEditRow: mockOnChangeEditRow, rowUnderEdit: true});
        editableDateField.find('DatePicker input').simulate('click');
        editableDateField.find('DatePicker div.react-datepicker__day').first().simulate('click');
        await flushPromises();
        expect(mockOnChangeEditRow).toBeCalledWith('2017-12-31');
    });


    it('saves changes on outside click successfully', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableDateField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.instance().closeEdit();
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('value')).toEqual('2018-01-01');
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves changes on outside click with error', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                value={'2000-01-01'}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableDateField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.instance().closeEdit();
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('currentValue')).toEqual('2000-01-01');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the changes on outside click if the value is invalid`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                value={'2000-01-01'}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableDateField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableDateField.setState({currentValue: ''});
        editableDateField.instance().closeEdit();
        expect(mockOnUpdateField).not.toBeCalled();
        await flushPromises();
        expect(mockHandleShowMessage).not.toBeCalled();
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save row changes on outside click`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.reject());
        const mockOnUpdateRow = jest.fn(() => Promise.resolve());

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                onUpdateRow={mockOnUpdateRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableDateField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableDateField.instance().closeEdit();
        expect(mockOnUpdateField).not.toBeCalled();
        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves changes on escape successfully', async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableDateField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.find('DatePicker').simulate('keydown', {key: 'Escape'});
        expect(mockOnUpdateField).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('value')).toEqual('2018-01-01');
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save the changes on escape when the value is invalid`, async () => {
        const mockOnUpdateField = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateField={mockOnUpdateField}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableDateField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableDateField.setState({currentValue: ''});
        editableDateField.find('DatePicker').simulate('keydown', {key: 'Escape'});
        expect(mockOnUpdateField).not.toBeCalled();
        await flushPromises();
        expect(mockOnFinishEditRow).not.toBeCalled();
        expect(mockHandleShowMessage).not.toBeCalled();

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it(`doesn't save changes on any key`, async () => {
        const mockOnUpdateRow = jest.fn(() => Promise.resolve());

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateRow={mockOnUpdateRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );

        editableDateField.find('DatePicker').simulate('keydown', {key: 'Any'});
        expect(mockOnUpdateRow).not.toBeCalled();
    });
    it('saves row changes on enter successfully', async () => {
        const mockOnUpdateRow = jest.fn(() => Promise.resolve());
        const mockHandleShowMessage = jest.fn();
        const mockOnFinishEditRow = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateRow={mockOnUpdateRow}
                handleShowMessage={mockHandleShowMessage}
                onFinishEditRow={mockOnFinishEditRow}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableDateField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.find('DatePicker').simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateRow).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('value')).toEqual('2018-01-01');
        expect(mockOnFinishEditRow).toBeCalledWith(1, 'testName');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row edited successfully', 'ok');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('saves row changes on enter with error', async () => {
        const mockOnUpdateRow = jest.fn(() => Promise.reject());
        const mockHandleShowMessage = jest.fn();

        editableDateField = shallow(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={mockOnClickEditRow}
                rowId={1}
                onUpdateRow={null}
                rowUnderEdit={true}
                onUpdateRow={mockOnUpdateRow}
                handleShowMessage={mockHandleShowMessage}
                value={'2000-01-01'}
                validateRow={mockValidateRow}
                validators={validators}
            />
        );
        const getErrorsNow = jest.spyOn(editableDateField.instance(), 'getErrorsNow');
        getErrorsNow.mockClear();

        editableDateField.setState({currentValue: '2018-01-01'});
        editableDateField.find('DatePicker').simulate('keydown', {key: 'Enter'});
        expect(mockOnUpdateRow).toBeCalled();
        await flushPromises();
        expect(editableDateField.state('currentValue')).toEqual('2000-01-01');
        expect(mockHandleShowMessage).toBeCalledWith('Selected row could not be saved', 'error');

        expect(getErrorsNow).toHaveBeenCalledTimes(1);
    });

    it('displays a tooltip on a validation error', () => {
        editableDateField = mount(
            <EditableDateField
                column={{ name: 'testName', value: 'testValue' }}
                onClickEditRow={() => jest.fn()}
                rowId={1}
                rowUnderEdit={true}
                handleShowMessage={() => jest.fn()}
                value={'2000-01-01'}
                validateRow={mockValidateRow}
                invalidClassName={'invalid'}
                validators={validators}
            />
        );

        editableDateField.setState({
            errorMessage: 'There is an error!',
            isValid: false,
        });

        expect(editableDateField.find('Tooltip').length).toEqual(1);
        expect(editableDateField.find('input').hasClass('invalid')).toEqual(true);
    });

});
