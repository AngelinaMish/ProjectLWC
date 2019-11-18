import { LightningElement, track, api, wire} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Mix__c.Name';

const fields = [NAME_FIELD];

export default class mixPage extends LightningElement {
    @api recordId

    @track clickedButtonLabel;

    @wire(getRecord, { recordId: '$recordId', fields })
    mix;

    get name() {
        return getFieldValue(this.mix.data, NAME_FIELD);
    }

    handleSaveClick (event){
        this.clickedButtonLabel = event.target.label;
    }

}