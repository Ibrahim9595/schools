import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { remove, findIndex } from 'lodash';
import 'rxjs/add/operator/switchMap';

import { ClassServiceService } from './class-service.service';

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
  }

  updateTimeTable(data) {
    this.service.updateTimeTable(data)
      .subscribe(({ data }) => {
        console.log(data);
      })
  }

  addtoWaitingList(student, el: HTMLLIElement) {
    let index = findIndex(this.studentWaitingList, { id: student.id });

    if(index != -1){
      this.studentWaitingList.splice(index, 1);
      this.studentSendList.splice(index, 1);
      el.className = el.className.replace('w3-teal', '');
    }else{
      this.studentWaitingList.push(student);
      this.studentSendList.push(student.id);
      el.className += ' w3-teal';
    }
  } 

  appendStudentsToClass() {
    this.service.appendStudentsToClass(this.class.id, this.studentSendList)
    .subscribe(({data}) => {
      this.studentWaitingList.map(student => {this.class.students.push(student)});
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
}
