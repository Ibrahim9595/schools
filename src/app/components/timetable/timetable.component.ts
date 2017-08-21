import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { groupBy, remove, find } from 'lodash';

import { TimetableElement } from './timetable-element';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})

export class TimetableComponent implements OnInit {
  @Input('classId') classId: string;
  @Input('timeTable') timeTable: object;
  @Input('subjects') subjects: any[]; 
  @Input('editable') editable: boolean;
  @Output('save') save = new EventEmitter();

  days = [
    {
      day: 'Sat',
      dayNum: 0
    },
    {
      day: 'Sun',
      dayNum: 1
    },
    {
      day: 'Mon',
      dayNum: 2
    },
    {
      day: 'Tue',
      dayNum: 3
    },
    {
      day: 'Wed',
      dayNum: 4
    },
    {
      day: 'Thu',
      dayNum: 5
    },
    {
      day: 'Fri',
      dayNum: 7
    }
  ];
  daysName = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  errors = [];
  valid = 0;

  constructor() { }
  
  ngOnInit() {
    this.timeTable = groupBy(this.timeTable, 'day');
    for(let t in this.timeTable) {
      remove(this.days, {day: t});
    }
  }

  addToTable(dayNum) {
    let day = remove(this.days, { dayNum: parseInt(dayNum) })[0];
    this.timeTable[day.day] = [];
  }
  
  addTimeSlot(day) {
    let dayNum =  this.daysName.indexOf(day);
    let id = day+dayNum+this.timeTable[day].length;
    this.timeTable[day].push(new TimetableElement(id, day, dayNum.toString()));
    
    this.valid ++;
  }

  removeElement(id, day) {
    remove(this.timeTable[day], { id: id });
    if(isNaN(id))
      this.valid --;
  }

  elementDone(element, day) {
    let timetableElement = find(this.timeTable[day], { id: element.id });

    if(isNaN(element.id))
      this.valid --;

    for(let i in element) {
      timetableElement[i] = element[i];
    }
  }

  validateTable() {
    for(let i in this.timeTable) {
      this.timeTable[i].sort((a, b) => {return a.timeStart > b.timeStart});
      for(let j=1; j < this.timeTable[i].length; j++){
        if(this.timeTable[i][j-1].timeEnd > this.timeTable[i][j].timeStart){
          this.errors.push(`Invalid interval number ${j+1} in day ${i}`);
        }
      }
    }
    
    if(this.valid != 0){
      this.errors.push('One of time slot is not right');
    }

    return this.errors.length == 0;
      
  }
 
  submitTable() {
    this.errors = [];
   
    if(!this.validateTable())
      return;

    let ret = {
      classId: this.classId,
      subjectStaff: []
    };

    for(let i in this.timeTable) {
      for(let element of this.timeTable[i]){
        if(!element.subjectId && element.subject){
          if(element.subject.id)
            element.subjectId = element.subject.id;
        }

        if(!element.staffId && element.staff){
          if(element.staff.id)
            element.staffId = element.staff.id;
        }

        let temp = {
          ...element
        };

        delete temp.subject;
        delete temp.staff;
        delete temp.id;

        ret.subjectStaff.push(temp);
      }
    }
    
    //this.save.emit(ret);
  }
}
