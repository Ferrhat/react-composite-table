import React from 'react';
import {shallow, mount} from 'enzyme';
import Footer from "../../lib/components/footer";


describe('Footer', () => {
    const tableData = [
        {
            id: 1,
            username: 'Komárom'
        },
        {
            id: 2,
            username: 'Zalaegerszeg'
        },
        {
            id: 3,
            username: 'Budapest'
        }
    ];

    const numberOfRowsShow = 1;
    const allPagesNumber = Math.round(tableData.length / numberOfRowsShow);
    const currentPageNumberChange = jest.fn();
    const pageSizeChange = jest.fn();

    const footer = mount(
        <Footer tableData={tableData}
                onPageSizeChange={pageSizeChange}
                onCurrentPageNumberChange={currentPageNumberChange}
                defaultNumberOfRowsShow={numberOfRowsShow}/>
    );

    it('renders properly', () => {
        expect(footer).toMatchSnapshot();
    });

    it('has current page number', () => {
        expect(footer.state('currentPage')).toEqual(1);
    });

    it('has total number of pages', () => {
        const totalNumberOfPages = footer.find('#total-number-of-page');
        const allPagesNumber = footer.state('allPagesNumber');

        expect(allPagesNumber).toEqual(3);
    });

    it('has total number of rows', () => {
        const totalNumberOfRows = footer.state('allPagesNumber');

        expect(totalNumberOfRows).toEqual(3);
    });

    it('shows total number of rows', () => {
        const totalNumberOfRowsText = footer.find('#total-rows-number').text();

        expect(totalNumberOfRowsText).toEqual("Total: 3");
    });

    it('shows current page number', () => {
        const currentPageNumber = footer.find('#current-page-number').instance().value;

        expect(currentPageNumber).toEqual("1");
    });

    it('calculates all pages number', () => {
        const spy = jest.spyOn(Footer.prototype, 'componentDidMount');
        const wrapper = shallow(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );
        wrapper.instance().componentDidMount();
        expect(spy).toHaveBeenCalled();
    });

    it('go to previous page after click on that button', () => {
        const spy = jest.spyOn(Footer.prototype, 'onClickPreviousButton');
        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );
        const instance = wrapper.instance();
        wrapper.find('#previous-button').simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);

        const currentPage = wrapper.state('currentPage');
        expect(currentPage).toEqual(1);
    });

    it('go to next page after click on that button', () => {
        const spy = jest.spyOn(Footer.prototype, 'onClickNextButton');
        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );
        const instance = wrapper.instance();
        wrapper.find('#next-button').simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);

        const currentPage = wrapper.state('currentPage');
        expect(currentPage).toEqual(2);
    });

    it('stays on same page, when clicking next page on the last page', () => {
        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );

        wrapper.setState({ currentPage: 3}, () => {
            wrapper.find('#next-button').simulate('click');
            const currentPage = wrapper.state('currentPage');
            expect(currentPage).toEqual(3);
        });
    });

    it('go to first page after click on that button', () => {
        const spy = jest.spyOn(Footer.prototype, 'onClickFirstButton');
        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );
        const instance = wrapper.instance();
        wrapper.find('#first-button').simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);

        const currentPage = wrapper.state('currentPage');
        expect(currentPage).toEqual(1);
    });

    it('go to last page after click on that button', () => {
        const spy = jest.spyOn(Footer.prototype, 'onClickLastButton');
        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );
        const instance = wrapper.instance();
        wrapper.find('#last-button').simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);

        const currentPage = wrapper.state('currentPage');
        expect(currentPage).toEqual(3);
    });

    it('changes current page input value', () => {
        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );

        wrapper.find('#current-page-number').simulate('change', {target: {value: '200'}});
        let inputValue = wrapper.find('#current-page-number').instance().value;

        expect(inputValue).toEqual("3");

        wrapper.find('#current-page-number').simulate('change', {target: {value: 'F'}});
        inputValue = wrapper.find('#current-page-number').instance().value;

        expect(inputValue).toEqual("1");
    });

    it('changes current row input value', () => {
        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );

        wrapper.find('#current-row-number').simulate('change', {target: {value: '-200'}});
        let inputValue = wrapper.find('#current-row-number').instance().value;

        expect(inputValue).toEqual(numberOfRowsShow.toString());

        wrapper.find('#current-row-number').simulate('change', {target: {value: 'F'}});
        inputValue = wrapper.find('#current-row-number').instance().value;

        expect(inputValue).toEqual(numberOfRowsShow.toString());

        wrapper.setState({currentPage: 100});
        wrapper.find('#current-row-number').simulate('change', {target: {value: '1'}});
        inputValue = wrapper.find('#current-row-number').instance().value;

        expect(wrapper.state('currentPage')).toEqual(3);
    });

    it('handles keyboard navigation', () => {
        const map = {};
        window.addEventListener = jest.fn((event, cb) => {
          map[event] = cb;
        });

        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );

        wrapper.setState({currentPage: 1});
        map.keydown({key: 'ArrowRight', path: [{tagName: 'INPUT'}]});
        expect(wrapper.state('currentPage')).toEqual(1);
        map.keydown({key: 'ArrowUp'});
        expect(wrapper.state('currentPage')).toEqual(1);
        map.keydown({key: 'ArrowRight'});
        expect(wrapper.state('currentPage')).toEqual(2);
        map.keydown({key: 'ArrowLeft'});
        expect(wrapper.state('currentPage')).toEqual(1);

        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');
        wrapper.unmount();
        expect(componentWillUnmount).toHaveBeenCalled();

    });

    it('recalculates page number on changes', () => {
        let wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );

        wrapper.setState({currentPage: 100});
        wrapper.setProps({randomProp: 'testValue'});
        expect(wrapper.state('currentPage')).toEqual(3);
        wrapper.unmount();

        wrapper = mount(
            <Footer tableData={[]}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );
        wrapper.setProps({randomProp: 'testValue'});
        expect(wrapper.state('currentPage')).toEqual(1);
        wrapper.setProps({tableData: tableData});
        expect(wrapper.state('currentPage')).toEqual(1);

    });

});
