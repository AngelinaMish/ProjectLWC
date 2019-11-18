import { LightningElement, track} from 'lwc';

export default class mixSummary extends LightningElement {

    @track remainingTracks = 20;
    @track remainingMixLength = 90;
    @track trackCount;
    @track mixLength;

}