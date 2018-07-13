import React, {Component} from "react";
import EditableTextField from './editableColumnFields/editableTextField';
import EditableSelectField from './editableColumnFields/editableSelectField';
import EditableDateField from './editableColumnFields/editableDateField';

class tableFieldFactory extends Component {

    static build(data) {
        switch (data.type) {
            case 'text':
                return <EditableTextField { ... data } />;
            case 'select':
                return <EditableSelectField { ... data } />;
            case 'date':
                return <EditableDateField { ... data } />;
            default:
                return undefined;
        }
    }

}

export default tableFieldFactory;
