import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SubjectServiceService } from './subject-service.service';

import { remove, find } from 'lodash';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  providers: [SubjectServiceService]
})

export class SubjectComponent implements OnInit {
  subject: any;
  openedTab: number = 0;
  allStaff: any[];
  newUserId = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SubjectServiceService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.service.init(parseInt(params.get('id'))))
      .subscribe(({ data }) => {
        this.subject = data.subject;
      });
  }

  getAllStaff() {
    this.service.getAllStaff()
    .subscribe(({ data }) => {
      this.allStaff = data.staffs;
    });
  }

  addStaffToSubject(staffId, subjectId, rate) {
    if(!staffId || !subjectId || !rate)
      return;

    let staff = {
      ...find(this.allStaff, { id: parseInt(staffId) }),
      rate: rate
    };
    
    this.service.addStaffToSubject(staffId, subjectId, rate)
    .subscribe(({ data }) => {
      this.subject.staff.push(staff);
      this.newUserId = null;
    });
  }

  updateStaffToSubject(staffId, subjectId, rate) {
    this.service.updateStaffToSubject(staffId, subjectId, rate)
    .subscribe(({ data }) => {
      alert('updated');
    });
  }

  deleteStaffFromSubject(staffId, subjectId) {
    let confirmation = confirm("Are you sure you want remove that teacher?");
    
    if(confirmation) {
      this.service.deleteStaffFromSubject(staffId, subjectId)
      .subscribe(({ data }) => {
        remove(this.subject.staff, { id: staffId });
      });
    }
  }

}
