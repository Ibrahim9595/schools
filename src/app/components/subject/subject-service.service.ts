import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NoCashedQueryService } from '../../no-cashed-query.service';
import gql from 'graphql-tag';

import { find } from 'lodash';
import 'rxjs/add/operator/map';

@Injectable()

export class SubjectServiceService {

  constructor(private apollo: Apollo, private service: NoCashedQueryService) { }

  init(id: number) {
    let subject = `
    query subject($id: Int!) {
      subject(id: $id) {
        id
        name
        details
        syllabus
        
        level {
          name
        }
        
        staff {
          id
          name
          email
          gender
          img
          rate
          staff_type{
            type
          }
        }
      }
    }`;

    return this.service.getUnCashed({
      operationName: 'subject',
      query: subject,
      variables: { id }
    });
  }

  getAllStaff() {
    let staffs = gql`
    query staffs {
      staffs {
        id
        name
        email
        gender
        img
        rate
        staff_type{
          type
        }
      }
    }`;
    
    interface data {
      staffs: any
    }

    return this.apollo.watchQuery<data>({
      query: staffs
    });
  }

  addStaffToSubject(staffId, subjectId, rate) {
    const addStaffToSubject = gql`
      mutation addStaffToSubject($staffId: Int!, $subjectId: Int!, $rate: Int!){
        addStaffToSubject(staffId: $staffId, subjectId: $subjectId, rate: $rate)
      }
    `;

    interface data {
      addStaffToSubject: boolean
    }

    return this.apollo.mutate<data>({
      mutation: addStaffToSubject,
      variables: {
        staffId,
        subjectId,
        rate
      }
    });
  }

  updateStaffToSubject(staffId, subjectId, rate) {
    const updateStaffToSubject = gql`
      mutation updateStaffToSubject($staffId: Int!, $subjectId: Int!, $rate: Int!){
        updateStaffToSubject(staffId: $staffId, subjectId: $subjectId, rate: $rate)
      }
    `;

    interface data {
      updateStaffToSubject: boolean
    }

    return this.apollo.mutate<data>({
      mutation: updateStaffToSubject,
      variables: {
        staffId,
        subjectId,
        rate
      }
    });
  }

  deleteStaffFromSubject(staffId, subjectId) {
    const deleteStaffFromSubject = gql`
      mutation deleteStaffFromSubject($staffId: Int!, $subjectId: Int!){
        deleteStaffFromSubject(staffId: $staffId, subjectId: $subjectId)
      }
    `;

    interface data {
      deleteStaffFromSubject: boolean
    }

    return this.apollo.mutate<data>({
      mutation: deleteStaffFromSubject,
      variables: {
        staffId,
        subjectId
      }
    });
  }
}
