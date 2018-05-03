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

```javascript
import Table2 from 'react-composite-table';

class UserTable extends Component {

    render() {
        if(this.props.allUsers) {
            const columns = [
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
                },
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
                }
            ];
            
            return (
                <div>
                    <Table2
                        data={this.props.allUsers}
                        columns={columns}
                        onDeleteRow={this.props.deleteRow}
                    />
                </div>
            );
        } else {
            return (
                <div style={{marginTop: "20px", marginLeft: "20px"}}>
                    <span className="icon-spinner icon-spinner-large"></span>
                </div>
            );
        }
    }
}
```

# For package developers

##Steps:
- Clone github repository to your local computer
- Go to the library folder and run 'npm run build' to make a build and watch modification
- Open your project and include the library with 'npm link react-composite-table' 