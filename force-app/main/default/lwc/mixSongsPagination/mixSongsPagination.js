import { LightningElement, track, api } from 'lwc';

export default class MixSongsPagination extends LightningElement {

    @track isButtonPrevDisabled = true;

    @api pageNumber;
    @api isButtonNextDisabled = false;
    @api totalPageNumber;
    @api pageSize;
    @api songDataLength;

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
        if (this.pageNumber === 1) {
            this.handleFirstPage();
        } else {
            this.setPage((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
            this.isButtonNextDisabled = false;
        }
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
        if (this.pageNumber === this.totalPageNumber) {
            this.handleLastPage();
        } else {
            this.setPage((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
            this.isButtonPrevDisabled = false;
        }
    }

    handleFirstPage() {
        this.pageNumber = 1;
        this.setPage(0, this.pageSize);
        this.isButtonPrevDisabled = true;
        if (this.totalPageNumber > 1) {
            this.isButtonNextDisabled = false;
        }
    }

    handleLastPage() {
        this.pageNumber = this.totalPageNumber;
        this.setPage((this.pageNumber - 1) * this.pageSize, this.songDataLength);
        this.isButtonNextDisabled = true;
        if (this.totalPageNumber > 1) {
            this.isButtonPrevDisabled = false;
        }
    }

    setPage(start, end) {
        const detail = {
            pageNumber: this.pageNumber,
            start: start,
            end: end
        }
        const setPageEvent = new CustomEvent('setpage', { detail: detail });
        this.dispatchEvent(setPageEvent);
    }
}