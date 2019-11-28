import { LightningElement, track, api, wire} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import saveMix from '@salesforce/apex/mixSongsController.saveMix';
import NAME_FIELD from '@salesforce/schema/Mix__c.Name';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const fields = [NAME_FIELD];

export default class mixPage extends LightningElement {
    
    @api recordId;
    @track trackCount;
    @track mixLength;
    @track songsIds;
    mixDetails;
    errorFromMixDetails;

    @wire(getRecord, { recordId: '$recordId', fields })
    mix;

    get name() {
        let returnName = getFieldValue(this.mix.data, NAME_FIELD);

        if (returnName) {
            return returnName;
        }
        return 'NEW';
    }

    setMixDetails(event) {

        if (event.detail.isError) {
            this.errorFromMixDetails = true;
        }
        else {
            this.mixDetails = {
                "Id": this.recordId,
                "Name": event.detail.name,
                "Customer__c": event.detail.contact
            }
        } 
    }

    handleSaveClick() {    
        this.template.querySelector('c-mix-details').getMixDetails();
        
        if(this.errorFromMixDetails) {
            return;
        }

        saveMix({
            songsIds: Array.from(this.songsIds),
            mixId: this.mixDetails
        })
            .then (() => {
                this.showToast('Success','Mix was created', 'success' );
                this.navigateToListView();
            })
            .catch(() => {
                this.showToast('Error', 'Please Select Song with license', 'error' );
            });
    }

    rowSelectedHandler(event) {
        this.songsIds = event.detail.songsIds;
        this.template.querySelector('c-mix-summary').setSettings(event.detail);
    }

    showToastHandler(event) {
        this.showToast(event.detail.title, event.detail.message, event.detail.variant);
    }

    showToast(title, message, variant) {
        const showToast = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(showToast);
    }

    navigateToListView() {
        window.location.href = window.location.port + '/lightning/o/Mix__c/list?filterName=Recent';
    }
}