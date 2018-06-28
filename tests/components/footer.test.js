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

    /*const tableData = [
        {
            id: 1,
            username: 'User1'
        },
        {
            id: 2,
            username: 'User2'
        },
        {
            id: 3,
            username: 'User3'
        }
    ];

    const numberOfRowsShow = 1;
    const allPagesNumber = Math.round(tableData.length / numberOfRowsShow);
    const currentPageNumberChange = jest.fn();
    const pageSizeChange = jest.fn();

    const footer = shallow(
        <Footer tableData={tableData}
                onPageSizeChange={pageSizeChange}
                onCurrentPageNumberChange={currentPageNumberChange}
                defaultNumberOfRowsShow={numberOfRowsShow}/>
    );

    it('renders properly', () => {
        expect(footer).toMatchSnapshot();
    });

    it('contains a connected Wallet component', () => {
        expect(footer.state('currentPage')).toEqual(1);
        expect(footer.state('allPagesNumber')).toEqual(allPagesNumber);
        expect(footer.state('numberOfRows')).toEqual(numberOfRowsShow);
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
    });
*/
    /*it('calculates all pages number', () => {
        const spy = jest.spyOn(Footer.prototype, 'componentDidMount');
        const wrapper = mount(
            <Footer tableData={tableData}
                    onPageSizeChange={pageSizeChange}
                    onCurrentPageNumberChange={currentPageNumberChange}
                    defaultNumberOfRowsShow={numberOfRowsShow}/>
        );
        wrapper.instance().componentDidMount();
        expect(spy).toHaveBeenCalled();
    });*/

});