import { Subject } from './subject';
import { Staff } from './staff';

export class TimetableElement {
    constructor
    (
        public id: string,
        public day: string,
        public dayNum: string,
        public timeStart?: string,
        public timeEnd?: string,
        public subject?: Subject[],
        public staff?: Staff[]
    ) { }
}
