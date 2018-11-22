import React, {Component} from 'react';
import Table from '../../src/components/table';
import BasicTable from "./tables/BasicTable";

export default class DemoPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='container'>
                <div className="row">
                    <div className="col pt-3 pb-3">
                        <h1>Demo page</h1>
                        <p>Table demo</p>
                        <div className='coordinatesTable'>
                            <BasicTable />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}