import { LightningElement, api } from 'lwc';

const ENTER_KEY_CODE = 13;

export default class MixSongSearch extends LightningElement {

    @api setErrorInput() {
        let inputName = this.template.querySelector("lightning-input");
        inputName.setCustomValidity('Songs with this name not found');
        inputName.reportValidity();
    } 

    handleSearchEnterClick(event) {

        if (event.keyCode === ENTER_KEY_CODE) {
            this.handleSearchClick();
        }
    }

    handleSearchClick() {
        let inputName = this.template.querySelector("lightning-input");
        inputName.setCustomValidity('');
        inputName.reportValidity();
        let serachName = inputName.value;
        const setPageEvent = new CustomEvent('search', { detail: serachName });
        this.dispatchEvent(setPageEvent);
    }

}