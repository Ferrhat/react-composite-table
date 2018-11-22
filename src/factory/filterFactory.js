import React, {Component} from "react";
import TextField from './filterFields/textField';
import SelectField from './filterFields/selectField';

class filterFactory extends Component {

    static build(data) {
        if (!data.filterable) {
            return <span />;
        }
        switch (data.type) {
            case 'text':
                return <TextField { ... data } />;
            case 'select':
                return <SelectField { ... data } />;
            default:
                return <span />;
        }
    }

}

export default filterFactory;
