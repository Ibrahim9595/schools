export class TimeTableElement {
    constructor
    (
        public timeStart?: string,
        public timeEnd?: string,
        public subjectId?: string,
        public staffId?: string,
        public day?: string,
        public dayNum?: string,
        public id?: string
    ) { }

    validate() {
        let valid = [];

        valid.push(this.timeStart.match('[0-9]{1,2}:[0-9]{1,2}') != null);
        valid.push(this.timeEnd.match('[0-9]{1,2}:[0-9]{1,2}') != null);
        valid.push(this.timeEnd > this.timeStart);
        valid.push(typeof(parseInt(this.subjectId)) == 'number');
        valid.push(typeof(parseInt(this.staffId)) == 'number');

        for(let v of valid){
            if(!v)
                return false;
        }
        return true;
    }
}
