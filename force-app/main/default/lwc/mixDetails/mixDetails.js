import { LightningElement, track, api} from 'lwc';

export default class mixDetails extends LightningElement {
    @api recordId;
    @api name;
    @api customer;

    @track isTrue = "true";



    
}