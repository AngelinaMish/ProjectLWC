import { LightningElement, track, api} from 'lwc';

export default class mixSummary extends LightningElement {

    @track  remainingTracks = 20;
    @track remainingMixLength = 90;
    @track trackCount = 0;
    @track mixLength = 0;

    @api setSettings (summary) {
        this.trackCount = summary.size;
        this.mixLength = summary.length;
        this.remainingTracks = 20 - summary.size;
        this.remainingMixLength = 90 - summary.length;
    }

}