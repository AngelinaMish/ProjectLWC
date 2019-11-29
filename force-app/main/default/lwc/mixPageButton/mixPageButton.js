import { LightningElement } from 'lwc';

export default class MixPageButton extends LightningElement {

    handleSaveClick() {
        const setPageEvent = new CustomEvent('save', {});
        this.dispatchEvent(setPageEvent);
    }

    navigateToListView() {
        const setPageEvent = new CustomEvent('cancel', {});
        this.dispatchEvent(setPageEvent);
    }
}