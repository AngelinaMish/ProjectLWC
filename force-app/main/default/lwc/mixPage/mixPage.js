import { LightningElement, track, api, wire} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import saveMix from '@salesforce/apex/MixPageController.saveMix';
import getPageSize from '@salesforce/apex/MixPageController.getPageSize';
import NAME_FIELD from '@salesforce/schema/Mix__c.Name';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const fields = [NAME_FIELD];

export default class mixPage extends LightningElement {
    
    @api recordId;

    @track trackCount;
    @track mixLength;
    @track songsIds;
    @track pageSize;
    @track primaryGenre;
    @track secondaryGenre;
    @track isLoaded = true;

    mixDetails;
    errorFromMixDetails;
    

    @wire(getRecord, { recordId: '$recordId', fields })
    mix;

    @wire(getPageSize)
    setPageSize(value) {
        this.pageSize = value.data;
    }

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
        } else {
            this.mixDetails = {
                "Id": this.recordId,
                "Name": event.detail.name,
                "Customer": event.detail.contact
            }
        }
    }

    handleSaveClick(event) {
        this.template.querySelector('c-mix-details').getMixDetails();

        if (this.errorFromMixDetails) {
            return;
        }

        this.isLoaded = false;
        saveMix({
                songsIds : Array.from(this.songsIds),
                mixId : this.mixDetails.Id,
                mixName : this.mixDetails.Name,
                mixCustomer : this.mixDetails.Customer
            })
            .then(mix => {
                let isRedirect = event.detail;
                this.showToast('Success', 'Mix was created', 'success');

                if (isRedirect) {
                    this.navigateToListView();
                }
                else {
                    this.primaryGenre = (mix.Primary_Genre__c === undefined) ? '' : mix.Primary_Genre__c;
                    this.secondaryGenre = (mix.Secondary_Genre__c === undefined) ? '' : mix.Secondary_Genre__c;
                }
            })
            .catch((error) => {
                this.showToast('Error', error.body.message, 'error');
            })
            .finally(() => {
                this.isLoaded = true;
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