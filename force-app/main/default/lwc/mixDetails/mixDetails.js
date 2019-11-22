import { LightningElement, api} from 'lwc';
//import { updateRecord } from 'lightning/uiRecordApi';

export default class mixDetails extends LightningElement {
    @api recordId;
    name;

    @api
    getMixDetails() {
        
      
        const fieldsvalues = this.template.querySelectorAll('lightning-input-field');
        if (!fieldsvalues[1].value){
            const message = {title: 'Error', message: 'Please fill Contact', variant: 'error'};
            this.fireShowToast(message);
            return false;
        }
        if (!fieldsvalues[1].value){
            const message = {title: 'Error', message: 'Please fill Name', variant: 'error'};
            this.fireShowToast(message);
            return false;
        }

        const mixDetailsValues = {
            name : fieldsvalues[0].value,
            contact : fieldsvalues[1].value
        }

        const setMixDetailsEvent = new CustomEvent('mixdetails', { detail: mixDetailsValues })
        this.dispatchEvent(setMixDetailsEvent);
        return true;
    }

    fireShowToast(message) {

        const  showToastEvent = new CustomEvent('showtoast', { detail:  message});
        this.dispatchEvent(showToastEvent);
    }






    
}