[![Build Status](https://travis-ci.org/davidcsejtei/react-composite-table.svg?branch=master)](https://travis-ci.org/davidcsejtei/react-composite-table) [![Coverage Status](https://coveralls.io/repos/github/davidcsejtei/react-composite-table/badge.svg)](https://coveralls.io/github/davidcsejtei/react-composite-table)

# How to use React Composite Table

The package gives you a general table component for ReactJS projects.

Table uses async actions to filter, order and edit table data.

## Define a table

Let's create your first table (eg.: UserTable for list and edit users).

These are the steps:
- define your table columns with an array
- collect your table data
- call your table with previously defined columns and collected data

Rules:
- You need to define your update action for each editable field separately

## Example (UserTable)

If you have the following data (e.g.: list of users) for the table:

```
[
    0: {
           id: 9,
           username: "testadmin",
           email: "admin@example.net",
           name: "Test Admin",
           roles: {
               "SUPER_ADMIN",
               "MANAGER"
           }
    }
    1: {
           id: 13,
           username: "firsteditor",
           email: "editor@example.net",
           name: "First Editor",
           roles: {
               "EDITOR"
           }
    }
]

```

And want to show ID, username and name attributes in the table:

```javascript
import Table2 from 'react-composite-table';

// You have to write all of your actions and add to the as a props
import { updateUserNameField, deleteRow } from '../actions/index';

class UserTable extends Component {

    render() {
        if(this.props.allUsers) {
            const columns = [
                {
                    label: 'ID',
                    name: 'Id',
                    value: 'Id',
                    filterable: true,
                    filterType: 'text',
                    filterableProperty: 'Id',
                    editable: false,
                    sortable: true,
                    sortableProperty: 'Id'
                },
                {
                    label: 'Username',
                    name: 'username',
                    value: 'username',
                    filterable: true,
                    filterType: 'text',
                    filterableProperty: 'username',
                    editable: false,
                    sortable: true,
                    sortableProperty: 'username'
                },
                {
                    label: 'Name',
                    name: 'name',
                    value: 'name',
                    filterable: true,
                    filterType: 'text',
                    filterableProperty: 'name',
                    editable: true,
                    updateFunction: this.props.updateUserNameField,
                    sortable: true,
                    sortableProperty: 'name'
                }
            ];
            
            return (
                <Table2
                    data={this.props.allUsers}
                    columns={columns}
                    onDeleteRow={this.props.deleteRow}
                />
            );
        } else {
            return (
                <span className="icon-spinner icon-spinner-large"></span>
            );
        }
    }
}

export default connect(null, {updateUserNameField, deleteRow})(UserTable);
```

# For package developers

##Steps:
- Clone github repository to your local computer
- Go to the library folder and run 'npm run build' to make a build and watch modification
- Open your project and include the library with 'npm link react-composite-table' 
