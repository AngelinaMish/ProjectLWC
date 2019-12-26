import { LightningElement, track, wire, api} from 'lwc';
import getSongsList from '@salesforce/apex/MixPageController.getSongsList';
import getTrackList from '@salesforce/apex/MixPageController.getTrackList';

const COLS = [
    { label: 'Song Name', fieldName: 'Name', sortable : true },
    { label: 'Genre', fieldName: 'Genre__c', sortable : true },
    { label: 'Artist', fieldName: 'Artist__c', sortable : true },
    { label: 'Length (m)', fieldName: 'Length_m__c', sortable : true, type: 'number', cellAttributes: { alignment: 'left' }},
    { label: 'Track License', fieldName: 'Track_Licenses__c', sortable : true, type: 'number', cellAttributes: { alignment: 'left' }}
];

export default class mixSongs extends LightningElement {

    @api recordId;
    @api pageSize;

    @track dataSong = [];
    @track columns = COLS;
    @track pageNumber = 1;
    @track totalPageNumber;
    @track songsPage = [];
    @track valueGenre;
    @track genres = [];
    @track allDataSong = [];
    @track selectedRows = [];
    @track allSelectedRows = new Set();
    @track songDataLength;
    @track sortBy = 'FirstName';
    @track sortDirection = 'asc';
    @track isButtonNextDisabled = true;
    @track isButtonPrevDisabled = true;

    didPaginationButtonCauseRowSelectionEvent = false;

    @wire(getSongsList)
    wiredSongsList(result) {
        if (result.data) {
            getTrackList({
                    mixId: this.recordId
                })
                .then((listSelectedSongs) => {
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
        let tempAllSelectedRows = [];
        listSelectedSongs.forEach(function (selectedSong) {
            allSongs.forEach(function (song) {

                if (song.Id === selectedSong) {
                    tempAllSelectedRows.push(song);
                }
            });
        });
        this.allSelectedRows = new Set(tempAllSelectedRows);
    }

    handleSortdata(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.dataSong));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : '';
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.dataSong = parseData;
        this.setTableSong();
    }
  
    getSelectedRows() {
        if (!this.didPaginationButtonCauseRowSelectionEvent) {
            let selectedRowsFromPage = this.template.querySelector('lightning-datatable').getSelectedRows();
            let tempAllSelectedRows = new Set();
            this.allSelectedRows.forEach(row => tempAllSelectedRows.add(row));
            this.songsPage.forEach(function(song) {
               tempAllSelectedRows.forEach(function(selectedSong) {
                if (song.Id === selectedSong.Id){
                    tempAllSelectedRows.delete(selectedSong);
                } 
               })
            });
            selectedRowsFromPage.forEach(row => tempAllSelectedRows.add(row));
            if (this.checkLengthAndSize(tempAllSelectedRows)) {
                this.allSelectedRows = tempAllSelectedRows;
                this.setDataToSummary();
            } else {
                this.setDataToSelectedRows();
            }
        } else {
            this.didPaginationButtonCauseRowSelectionEvent = false;
        }
    }

    checkLengthAndSize(tempAllSelectedRows) {
        let tempLength = 0;
        let message;
        tempAllSelectedRows.forEach(row => (tempLength += row.Length_m__c));

        if (tempLength > 90) {
            message = {
                title: 'Warning',
                message: 'Maximun songs length is 90',
                variant: 'warning'
            };
            this.fireShowToast(message);
            return false;
        }

        if (tempAllSelectedRows.size > 20) {
            message = {
                title: 'Warning',
                message: 'Maximun songs count is 20',
                variant: 'warning'
            };
            this.fireShowToast(message);
            return false;
        }

        return true;
    }

    fireShowToast(message) {
        const showToastEvent = new CustomEvent('showtoast', {
            detail: message
        });
        this.dispatchEvent(showToastEvent);
    }

    setDataToSummary() {
        let tempLength = 0;
        let tempIdsSongs = [];
        this.allSelectedRows.forEach(function (row) {
            tempLength = tempLength + row.Length_m__c;
            tempIdsSongs.push(row.Id);
        });
        let summary = {
            size: this.allSelectedRows.size,
            length: tempLength,
            songsIds: tempIdsSongs
        }
        const selectedEvent = new CustomEvent('selected', {
            detail: summary
        });
        this.dispatchEvent(selectedEvent);
    }

    setGenre() {
        let genresSongs = new Set();
        let genresTemp = [{
            label: 'all',
            value: 'all'
        }]
        this.dataSong.forEach(song => genresSongs.add(song.Genre__c));
        genresSongs.forEach(song => genresTemp.push({
            label: song,
            value: song
        }));
        this.genres = genresTemp;
    }

    setTableSong() {
        this.totalPageNumber = Math.ceil(this.dataSong.length / this.pageSize);
        this.setDataSong(0, this.pageSize);
        this.pageNumber = 1;
        //this.isButtonNextDisabled = false;
        //this.isButtonPrevDisabled = true;
        this.template.querySelector('c-mix-songs-pagination').isButtonNextDisabled = false;
        this.template.querySelector('c-mix-songs-pagination').isButtonPrevDisabled = true;

        if (this.totalPageNumber === 1) {
            //this.isButtonNextDisabled = true;
            this.template.querySelector('c-mix-songs-pagination').isButtonNextDisabled = true;
        }
    }

    handleChangeGenre(event) {
        if (event.detail.value === 'all') {
            this.dataSong = this.allDataSong;
            this.songDataLength = this.dataSong.length;
            this.setTableSong()
        } else {
            let dataSongTemp = [];
            this.valueGenre = event.detail.value;
            this.allDataSong.forEach(function (song) {

                if (song.Genre__c === event.detail.value) {
                    dataSongTemp.push(song);
                }
            });
            this.dataSong = dataSongTemp;
            this.songDataLength = this.dataSong.length;
            this.setTableSong();
        }
    }

    setDataSong(start, end) {
        this.songsPage = this.dataSong.slice(start, end);
        let selectedRowsFromPage = this.template.querySelector('lightning-datatable').getSelectedRows();

        if (selectedRowsFromPage.length !== 0)
        {
            this.didPaginationButtonCauseRowSelectionEvent = true;
        }

        this.setDataToSelectedRows();
    }

    setDataToSelectedRows() {
        let tempSet = this.allSelectedRows;
        let tempSelectedRows = [];
        this.songsPage.forEach(function (song) {
            tempSet.forEach(function (selectedSong) {

                if (selectedSong.Id === song.Id) {
                    tempSelectedRows.push(song.Id)
                }
            });
        });
        this.selectedRows = tempSelectedRows;
    }

    setPage(event) {
        this.pageNumber = event.detail.pageNumber;
        this.setDataSong(event.detail.start, event.detail.end);
    }

    handleSearch(event) {
        let searchName = event.detail.toLowerCase();
        let searchTable = this.allDataSong.filter(function(song) {
            var songName = song.Name.toLowerCase();
            return songName.includes(searchName);
        });
        this.dataSong = searchTable;
        this.songDataLength = searchTable.length;
        this.setTableSong();
    }

}