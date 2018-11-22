import React, {Component} from 'react';
import {toNumber, ceil, get} from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default class Footer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            numberOfRows: this.props.defaultNumberOfRowsShow,
            allPagesNumber: 1,
        }

        this.onCurrentPageChange = this.onCurrentPageChange.bind(this);
        this.onNumberOfRowsChange = this.onNumberOfRowsChange.bind(this);
        this.changeAllPagesNumber = this.changeAllPagesNumber.bind(this);
        this.onClickPreviousButton = this.onClickPreviousButton.bind(this);
        this.onClickFirstButton = this.onClickFirstButton.bind(this);
        this.onClickLastButton = this.onClickLastButton.bind(this);
        this.onClickNextButton = this.onClickNextButton.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.refreshCurrentPageNumber = this.refreshCurrentPageNumber.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const pages = Math.round(nextProps.tableData.length / this.state.numberOfRows);
        const allPagesNumber = pages < 1 ? 1 : pages;
        const currentPage = this.state.currentPage;

        this.setState({
            allPagesNumber
        });

        if (currentPage > allPagesNumber) {
            this.refreshCurrentPageNumber(allPagesNumber);
        }
    }

    componentDidMount() {
        const pages = Math.round(this.props.tableData.length / this.state.numberOfRows);
        const allPagesNumber = pages < 1 ? 1 : pages;

        this.setState({
            allPagesNumber
        });

        this.refreshCurrentPageNumber(1);
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        if (get(event, 'path[0].tagName') == 'INPUT') {
            return null;
        }
        switch (event.key) {
            case 'ArrowRight':
                this.onClickNextButton();
                break;
            case 'ArrowLeft':
                this.onClickPreviousButton();
                break;
            default:
                break;
        }
    }

    onCurrentPageChange(event) {
        let newPage = toNumber(event.target.value);

        if (isNaN(newPage) || 0 == newPage) {
            newPage = 1;
        }

        if (newPage >= this.state.allPagesNumber) {
            newPage = this.state.allPagesNumber;
        }

        this.refreshCurrentPageNumber(newPage);
    }

    onNumberOfRowsChange(event) {
        let newNumberOfRows = toNumber(event.target.value);

        if (isNaN(newNumberOfRows)) {
            newNumberOfRows = this.props.defaultNumberOfRowsShow;
        }
        if (newNumberOfRows <= 0) {
            newNumberOfRows = this.props.defaultNumberOfRowsShow;
        }

        this.setState({
            numberOfRows: newNumberOfRows
        }, () => {
            this.changeAllPagesNumber(newNumberOfRows);
            this.props.onPageSizeChange(newNumberOfRows);
        });
    }

    changeAllPagesNumber(newNumberOfRows) {
        const allRowsNumber = this.props.tableData.length;
        const currentPage = this.state.currentPage;
        const allPagesNumber = ceil(allRowsNumber / newNumberOfRows);

        this.setState({
            allPagesNumber
        }, () => {
            if (currentPage > allPagesNumber) {
                this.refreshCurrentPageNumber(allPagesNumber);
            }
        });
    };

    onClickNextButton() {
        let nextPage = this.state.currentPage + 1;
        const allPages = this.state.allPagesNumber;

        if (nextPage >= allPages) {
            nextPage = allPages;
        }

        this.refreshCurrentPageNumber(nextPage);
    }

    onClickPreviousButton() {
        let nextPage = this.state.currentPage - 1;

        if (0 == nextPage) {
            nextPage = 1;
        }

        this.refreshCurrentPageNumber(nextPage);
    }

    onClickFirstButton() {
        this.refreshCurrentPageNumber(1);
    }

    onClickLastButton() {
        this.refreshCurrentPageNumber(this.state.allPagesNumber);
    }

    refreshCurrentPageNumber(currentPageNumber) {
        this.setState({
            currentPage: currentPageNumber
        });
        this.props.onCurrentPageNumberChange(currentPageNumber);
    }

    t2() {
        return(
            <td colSpan="6">
                <div className="n-table-total" id='total-rows-number'>
                    <span>{this.props.totalText ? this.props.totalText : 'Total'}: <span>{this.props.tableData.length}</span></span></div>
                <div className="n-table-pagenum">
                    <button type="button"
                            id="first-button"
                            className="btn btn-icon buttons"
                            onClick={this.onClickFirstButton}>
                        <FontAwesomeIcon icon={faAngleDoubleLeft} className="fa-sm" />
                    </button>
                    <button type="button"
                            id="previous-button"
                            className="btn btn-icon buttons"
                            onClick={this.onClickPreviousButton}>
                        <FontAwesomeIcon icon={faAngleLeft} className="fa-sm" />
                    </button>
                    <input
                        id='current-page-number'
                        value={this.state.currentPage}
                        onChange={this.onCurrentPageChange}
                        className="n-inputfield form-control"
                        style={{zIndex: 0}}
                    />
                    <span id='total-number-of-pages'>/{this.state.allPagesNumber}</span>
                    <button type="button"
                            className="btn btn-icon buttons"
                            id="next-button"
                            onClick={this.onClickNextButton}>
                        <FontAwesomeIcon icon={faAngleRight} className="fa-sm" />
                    </button>
                    <button id="last-button"
                            type="button"
                            className="btn btn-icon buttons"
                            onClick={this.onClickLastButton}>
                        <FontAwesomeIcon icon={faAngleDoubleRight} className="fa-sm" />
                    </button>
                </div>
                <div className="n-table-pageselect">
                    <div className="n-table-pagecombox">
                        <div className="input-group input-append dropdown combobox n-page-combox">
                            <input id='current-row-number'
                                   type="number"
                                   value={this.state.numberOfRows}
                                   onChange={this.onNumberOfRowsChange}
                                   name="quantity"
                                   className="n-inputfield form-control"
                                   style={{zIndex: 0}}
                                   min="1"/>
                        </div>
                    </div>
                    <div className="n-table-suffix" id="itemsPerPageText">
                        <span>{this.props.itemsPerPageText ? this.props.itemsPerPageText : 'items per page'}</span>
                    </div>
                </div>
            </td>
        );
    }

    t() {
        return(
            <td colspan="2">
                <div className="n-table-total" id='total-rows-number'>
                    <span>{this.props.totalText ? this.props.totalText : 'Total'}: <span>{this.props.tableData.length}</span></span>
                </div>
                <button type="button"
                        id="first-button"
                        className="btn btn-icon buttons"
                        onClick={this.onClickFirstButton}>
                    <FontAwesomeIcon icon={faAngleDoubleLeft} className="fa-sm" />
                </button>
            </td>
        );
    }

    render() {
        return (
            <tfoot>
            <tr>
                {this.t()}
            </tr>
            </tfoot>
        );
    }
}
