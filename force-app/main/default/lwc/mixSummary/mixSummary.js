import { LightningElement, track, api} from 'lwc';

const MAX_TRACKS = 20;
const MAX_LENGTH = 90;

export default class mixSummary extends LightningElement {

    @track remainingTracks = MAX_TRACKS;
    @track remainingMixLength = MAX_LENGTH;
    @track trackCount = 0;
    @track mixLength = 0;

    @api setSettings(summary) {
        this.trackCount = summary.size;
        this.mixLength = summary.length;
        this.remainingTracks = MAX_TRACKS - summary.size;
        this.remainingMixLength = MAX_LENGTH - summary.length;
    }
}