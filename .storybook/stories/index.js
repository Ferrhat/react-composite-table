import React from 'react';
import { storiesOf, setAddon } from '@storybook/react';

import Table from '../../src/index'; 

storiesOf('Custom table', module).addWithJSX('simple', function() {
   const tableColumns = [
        {
            label: 'Title',
            name: 'title',
            value: 'title',
            filterable: true,
            filterType: 'text',
            filterableProperty: 'title',
            editable: false,
            sortable: true,
            sortableProperty: 'title'
        },
        {
            label: 'Author',
            name: 'author',
            value: 'author',
            filterable: true,
            filterType: 'text',
            filterableProperty: 'author',
            editable: false,
            sortable: true,
            sortableProperty: 'author'
        }
    ];

    const tableData = [
        {
            title: 'One',
            author: 'One"s author'
        },
        {
            title: 'Two',
            author: 'Author of Two'
        },
    ];
    
    return <Table
        data={tableData}
        columns={tableColumns}
        defaultStyleClass=''
    />
});