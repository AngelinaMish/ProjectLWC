import { LightningElement } from 'lwc';

export default class MixSongSearch extends LightningElement {

    handleSearchClick() {
        let serachName = this.template.querySelector("lightning-input").value;
        const setPageEvent = new CustomEvent('search', { detail: serachName });
        this.dispatchEvent(setPageEvent);
    }

}