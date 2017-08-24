import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { remove, findIndex, find, groupBy } from 'lodash';

import { NewAssignmentFormOptions } from './new-assignment-form-options';
import { ClassServiceService } from './class-service.service';
import { NewAssignment } from './new-assignment';


@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [ClassServiceService]
})

export class ClassComponent implements OnInit {
  class: any;
  openedTab: number = 0;
  studentWaitingList: any[] = [];
  studentSendList: any[] = [];
  dateStart: string;
  dateEnd: string;
  currentSubject: any;
  absence: any[];
  absenceKeys: any = [];
  newAbsenceList: any;
  todayAbsence: object = {};
  assignments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ClassServiceService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.service.init(parseInt(params.get('id'))))
      .subscribe(({ data }) => {
        this.class = data.class;
      });

    let date = new Date();
    this.dateStart = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear();
    this.dateEnd = this.dateStart;
  }

  updateTimeTable(data) {
    this.service.updateTimeTable(data)
      .subscribe(({ data }) => {
        console.log(data);
      })
  }

  addtoWaitingList(student, el: HTMLLIElement) {
    let index = findIndex(this.studentWaitingList, { id: student.id });

    if (index != -1) {
      this.studentWaitingList.splice(index, 1);
      this.studentSendList.splice(index, 1);
      el.className = el.className.replace('w3-teal', '');
    } else {
      this.studentWaitingList.push(student);
      this.studentSendList.push(student.id);
      el.className += ' w3-teal';
    }
  }

  appendStudentsToClass() {
    this.service.appendStudentsToClass(this.class.id, this.studentSendList)
      .subscribe(({ data }) => {
        this.studentWaitingList.map(student => { this.class.students.push(student) });
        this.studentSendList = [];
        this.studentWaitingList = [];
      });
  }

  deleteStudentFromClass(studentId) {
    let confirmation = confirm("Are you sure you want to remove this student?");

    if (confirmation) {
      this.service.deleteStudentFromClass(this.class.id, studentId)
        .subscribe(({ data }) => {
          remove(this.class.students, { id: studentId });
        });
    }
  }

  getAbcence() {
    
    this.service.absence(this.dateStart, this.dateEnd, this.class.id)
      .subscribe(({ data }) => {
        this.absenceKeys = [];
        this.absence = groupBy(data.absence, 'date');
        for (let i in this.absence) {
          this.absence[i] = groupBy(this.absence[i], 'student.id');
          this.absenceKeys.push({ date: i, students: [] });
          for (let j in this.absence[i]) {
            this.absenceKeys[this.absenceKeys.length - 1].students.push(j);
          }
        }
      });
  }

  addNewAbsenceList(subject) {
    if(this.todayAbsence[subject.subject.id]) {
      this.newAbsenceList = this.todayAbsence[subject.subject.id];
      return;
    }
      

    this.currentSubject = subject;
    let date = new Date();
    let today = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear();
    
    this.service.absence(today, today, this.class.id, subject.subject.id)
    .subscribe(({ data }) => {
      this.newAbsenceList = {};
      for (let student of this.class.students) {
        let absent = find(data.absence, (data)=>{return data.student.id == student.id? data : false});

        this.newAbsenceList[student.id] = { 
          studentId: student.id, 
          notes: absent? absent.notes : '', 
          absent: absent? true : false 
        };
      }
      this.todayAbsence[subject.subject.id] = this.newAbsenceList;
    });
  }

  appendAbsenceDay() {
    let list = [];
    for (let el in this.newAbsenceList) {
      if (this.newAbsenceList[el].absent) {
        list.push({...this.newAbsenceList[el]});
        delete list[list.length-1].absent;
      }

    }

    let date = new Date();
    let today = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear();

    this.service
    .appendAbsenceDay(today, this.class.id, this.currentSubject.staff[0].id, this.currentSubject.subject.id, list)
      .subscribe(({ data }) => {
        alert("Absence Added");
      }, (err) => {
        console.log(err);
        alert('error');
      });
  }

  getAssignments(subject) {
    this.currentSubject = subject;
    this.service.assignments(this.class.id, subject.id)
    .subscribe(({ data }) => {
      
      for(let a of data.assignments){
        this.assignments.push(a);
      }
    });
  }

  test(){
    console.log(this.assignments.push({id: 2}));
  }
}
