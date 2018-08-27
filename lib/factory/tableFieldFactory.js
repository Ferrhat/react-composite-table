import React, {Component} from "react";
import EditableTextField from './editableColumnFields/editableTextField';
import EditableSelectField from './editableColumnFields/editableSelectField';
import EditableMultiSelectField from './editableColumnFields/editableMultiSelectField';
import EditableDateField from './editableColumnFields/editableDateField';

class tableFieldFactory extends Component {

    static build(data) {
        switch (data.type) {
            case 'text':
                return <EditableTextField { ... data } />;
            case 'select':
                return <EditableSelectField { ... data } />;
            case 'multiselect':
                return <EditableMultiSelectField { ... data } />;
            case 'date':
                return <EditableDateField { ... data } />;
            default:
                return undefined;
        }
    }

}

export default tableFieldFactory;
