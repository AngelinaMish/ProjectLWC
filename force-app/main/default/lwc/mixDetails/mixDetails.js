import { LightningElement, api } from 'lwc';

export default class mixDetails extends LightningElement {

    @api secondaryGenre;
    @api primaryGenre;
    @api recordId;

    @api
    getMixDetails() {
        const name = this.template.querySelector('.name').value;
        const contact = this.template.querySelector('.contact').value;
        var mixDetailsValues;

        if (!name) {
            const message = {
                title: 'Error',
                message: 'Please fill Name',
                variant: 'error'
            };
            this.fireShowToast(message);
            mixDetailsValues = {
                isError: true
            };
        } else if (!contact) {
            const message = {
                title: 'Error',
                message: 'Please fill Contact',
                variant: 'error'
            };
            this.fireShowToast(message);
            mixDetailsValues = {
                isError: true
            };
        } else {
            mixDetailsValues = {
                name: name,
                contact: contact
            };
        }

        const setMixDetailsEvent = new CustomEvent('mixdetails', {
            detail: mixDetailsValues
        })
        this.dispatchEvent(setMixDetailsEvent);
    }

    fireShowToast(message) {
        const showToastEvent = new CustomEvent('showtoast', {
            detail: message
        });
        this.dispatchEvent(showToastEvent);
    }
}