import { LightningElement, track, wire, api} from 'lwc';
import getSongsList from '@salesforce/apex/mixSongsController.getSongsList';
import getTrackList from '@salesforce/apex/mixSongsController.getTrackList';

const COLS = [
    { label: 'Song Name', fieldName: 'Name' },
    { label: 'Genre', fieldName: 'Genre__c' },
    { label: 'Artist', fieldName: 'Artist__c'},
    { label: 'Length (m)', fieldName: 'Length_m__c', type: 'number', cellAttributes: { alignment: 'left' }},
    { label: 'Track License', fieldName: 'Track_Licenses__c', type: 'number', cellAttributes: { alignment: 'left' }}
];

export default class mixSongs extends LightningElement {

    @api recordId;
    @track dataSong = [];
    @track columns = COLS;
    @track pageNumber = 1;
    @track totalPageNumber;
    // Remove hardcode from pageSize, mark it as api
    @api pageSize;
    @track songsList = [];
    @track valueGenre;
    @track genreList = [];
    @track allDataSong = [];
    @track selectedRows = [];
    @track selectedRowsSet = new Set ();
    @track songDataLength;
    didPaginationButtonCauseRowSelectionEvent = false;

    @wire(getSongsList)
    wiredSongsList(result) {
        if (result.data) {
            getTrackList({mixId: this.recordId})
            .then ((listSelectedSongs) => {
                this.allDataSong = result.data;
                this.dataSong = this.allDataSong;
                this.songDataLength = this.dataSong.length;
                this.setSelectedRows(listSelectedSongs, result.data);
                this.setTableSong();
                this.setDataToSummary();
                this.setGenre();
                this.didPaginationButtonCauseRowSelectionEvent = false;
            })
            .catch((error) => {
                this.fireShowToast(error);
            });
        }
    }

    setSelectedRows(listSelectedSongs, allSongs) {
        let tempSelectedRowsSet = [];
        listSelectedSongs.forEach(function(selectedSong){
            allSongs.forEach(function(song){

                if(song.Id === selectedSong){
                    tempSelectedRowsSet.push(song);
                }
            });
        });
        this.selectedRowsSet = new Set(tempSelectedRowsSet);
    }
  
    getSelectedRows() {

        if (!this.didPaginationButtonCauseRowSelectionEvent) {
            let selectedRowsFromPage = this.template.querySelector('lightning-datatable').getSelectedRows();     
            let tempSelectedRowSet = new Set();
            this.selectedRowsSet.forEach(row => tempSelectedRowSet.add(row));
            this.songsList.forEach(song => tempSelectedRowSet.delete(song));  
            selectedRowsFromPage.forEach(row => tempSelectedRowSet.add(row)); 

            if (this.checkLengthAndSize(tempSelectedRowSet)){
                this.selectedRowsSet =  tempSelectedRowSet ;
                this.setDataToSummary();
            }
            else {
                this.setDataToSelectedRows();
            }            
        } else {        
            this.didPaginationButtonCauseRowSelectionEvent = false;
        }
    }

    checkLengthAndSize( tempSelectedRowSet ) {
        
        let tempLength = 0;
        let message;
        tempSelectedRowSet.forEach(row => (tempLength += row.Length_m__c));

        if (tempLength > 90)  {
            message = {title: 'Warning', message: 'Maximun songs length is 90', variant: 'warning'};
            this.fireShowToast(message);
            return false;
        }

        if (tempSelectedRowSet.size > 20) {
            message = {title: 'Warning', message: 'Maximun songs count is 20', variant: 'warning'};
            this.fireShowToast(message);
            return false;
        }

        return true;
    }

    fireShowToast(message) {

        const  showToastEvent = new CustomEvent('showtoast', { detail:  message});
        this.dispatchEvent(showToastEvent);
    }

    setDataToSummary() {

        let tempLength = 0;
        let tempIdsSongs = [];
        this.selectedRowsSet.forEach(function(row) {
            tempLength = tempLength + row.Length_m__c;
            tempIdsSongs.push(row.Id);
        });
        let summary = {size: this.selectedRowsSet.size, length: tempLength, songsIds: tempIdsSongs}
        const  selectedEvent = new CustomEvent('selected', { detail: summary });
        this.dispatchEvent(selectedEvent);
    }

    setGenre() {
        let genreSet = new Set ();
        let genreTempList = [{label: 'all', value: 'all'}] 
        this.dataSong.forEach(song =>  genreSet.add( song.Genre__c));
        genreSet.forEach(song => genreTempList.push({label: song, value: song}));
        this.genreList = genreTempList;
    }

    setTableSong() {
        this.totalPageNumber = Math.ceil(this.dataSong.length/this.pageSize);
        this.setDataSong(0, this.pageSize);
        this.pageNumber = 1;

        if (this.totalPageNumber === 1){
            this.template.querySelector('c-mix-songs-pagination').isButtonNextDisabled = true;
        }
    }

    handleChangeGenre(event) {

        if (event.detail.value === 'all'){
            this.dataSong = this.allDataSong;
            this.songDataLength = this.dataSong.length;
            this.setTableSong()
        }
        else {
            let dataSongTemp = [];
            this.valueGenre =  event.detail.value;
            this.allDataSong.forEach( function(song) {

                if(song.Genre__c === event.detail.value){
                    dataSongTemp.push(song);
                }
            });
            this.dataSong = dataSongTemp;
            this.songDataLength = this.dataSong.length;
            this.setTableSong();
        }       
    }

    setDataSong(start, end) {
        this.songsList = this.dataSong.slice(start, end);
        this.didPaginationButtonCauseRowSelectionEvent = true;
        this.setDataToSelectedRows();
    }

    setDataToSelectedRows() {
        let tempSet = this.selectedRowsSet;
        let tempSelectedRows  = [];
        this.songsList.forEach(function(song){ 

            if (tempSet.has(song)){
                tempSelectedRows.push(song.Id)
            }
        });
        this.selectedRows = tempSelectedRows;
    }
    
    setPage(event) {
        console.log(event.detail.start, event.detail.end);
        this.pageNumber = event.detail.pageNumber;
        this.setDataSong(event.detail.start, event.detail.end);
    }
}