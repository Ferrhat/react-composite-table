import React, {Component} from "react";
import SelectField from './filterFields/selectField';

class tableFieldFactory extends Component {

    static build(data) {
        switch (data.type) {
            case 'text':
            case 'select':
                return <SelectField key={data.name}
                                    name={data.name}
                                    label={data.label}
                                    options={data.options}/>;
            default:
                return undefined;
        }
    }

}

export default tableFieldFactory;
