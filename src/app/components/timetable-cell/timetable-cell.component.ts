import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimeTableElement } from './time-table-element';

import { find } from 'lodash';

@Component({
  selector: 'app-timetable-cell',
  templateUrl: './timetable-cell.component.html',
  styleUrls: ['./timetable-cell.component.css']
})

export class TimetableCellComponent implements OnInit {
  @Input('subjects') subjects: any[];
  @Input('subject') subject: any;
  @Input('staff') staff: any;
  @Input('day') day: string;
  @Input('dayNum') dayNum: string;
  @Input('timeStart') timeStart: string;
  @Input('timeEnd') timeEnd: string;
  @Input('id') id: string;
  @Input('display') done: boolean;
  @Input('editable') editable: boolean;
  @Output('done') elementDone = new EventEmitter();
  @Output('removeElement') removeElement = new EventEmitter();
 
  error: boolean = false;
  subjectId: string;
  staffId: string;
  
  constructor() { }

  ngOnInit() {
    if(this.subject){
      this.subjectId = this.subject.id;
      this.subject = find(this.subjects, {id: this.subjectId});
    }

    if(this.staff){
      this.staffId = this.staff.id;
    }
  }

  getSubjectStaff(id) {
    this.subject = find(this.subjects, { id: parseInt(id) });
  }

  setStaffName(id) {
    this.staff = find(this.subject.staff, { id: parseInt(id) })
  }

  remove() {
    if(confirm('Remove from list?'))
      this.removeElement.emit(this.id);
  }

  finish() {
    if(!this.staffId){
      this.error = true;
      return;
    }
      
    let timeTableElement = new TimeTableElement
    (this.timeStart, this.timeEnd, this.subjectId, this.staffId, this.day, this.dayNum, this.id);
    
    this.error = !timeTableElement.validate();
    
    this.done = !this.error;
    
    if(this.done)
      this.elementDone.emit(timeTableElement);
  }
}
