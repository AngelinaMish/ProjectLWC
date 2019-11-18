import { LightningElement, track, wire} from 'lwc';
import getSongsList from '@salesforce/apex/mixSongsController.getSongsList';

const COLS = [
    { label: 'Song Name', fieldName: 'Name' },
    { label: 'Genre', fieldName: 'Genre__c' },
    { label: 'Artist', fieldName: 'Artist__c'},
    { label: 'Length (m)', fieldName: 'Length_m__c', type: 'number'},
];

export default class mixSongs extends LightningElement {

    @track dataSong = [];
    @track columns =COLS;
    @track pageNumber = 1;
    @track totalPageNmber;
    @track pageSize = 2;
    @track isButtonNextDisabled = true;
    @track isButtonPrevDisabled = true;
    @track songsList = [];
    @track valueGenre;
    @track genreList = [];


     @wire (getSongsList)
    wiredSongsList (result){
        if(result.data){
            this.totalPageNmber = Math.ceil(result.data.length/this.pageSize);
            this.dataSong = result.data;
            this.songsList = result.data.slice(0, this.pageSize);
            if (this.totalPageNmber > 1 ){
                this.isButtonNextDisabled = false;
            }
            this.setGenre();
        }
    }

    handlePrevPage() {
        this.pageNumber = this.pageNumber - 1;
        if (this.pageNumber === 1){
            this.handleFirstPage();
        }
        else {
            this.songsList = this.dataSong.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber  * this.pageSize);
            this.isButtonNextDisabled = false;
        }
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
        if (this.pageNumber === this.totalPageNmber){
            this.handleLastPage();
        }
        else {
            this.songsList = this.dataSong.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber  * this.pageSize);
            this.isButtonPrevDisabled = false;   
        }

    }

    handleFirstPage() {
        this.pageNumber = 1;
        this.songsList = this.dataSong.slice(0, this.pageSize);
        this.isButtonPrevDisabled = true;
        if(this.totalPageNmber > 1 ){
            this.isButtonNextDisabled = false;
        }
    }


    handleLastPage() {
        this.pageNumber = this.totalPageNmber;
        this.songsList = this.dataSong.slice((this.pageNumber - 1) * this.pageSize, this.dataSong.length);
        this.isButtonNextDisabled = true;
        if(this.totalPageNmber > 1 ){
            this.isButtonPrevDisabled = false;
        }
    } 

    // setGenre() {
    //     this.dataSong.forEach(song =>  this.genreList.push({label: song.Genre__c, value: song.Genre__c }));
    //     console.log (this.genreList);
    // }
    
  
}