import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NoCashedQueryService } from '../../no-cashed-query.service';
import gql from 'graphql-tag';

import { find } from 'lodash';
import 'rxjs/add/operator/map';


@Injectable()
export class ClassServiceService {

  constructor(private apollo: Apollo, private service: NoCashedQueryService) { }

  init(id: number) {
    let Class = `
      query class($id: Int!){
        class(id: $id){
          id
          name
          levelId
          capacity
          minGrade
          
          students{
            id
            name
            img
            gender
            email 
          }
          
          timeTable{
            id
            day
            dayNum
            timeStart
            timeEnd
            staff{
              id
              name
            }
            subject{
              id
              name
            }
          }
          
          classSubjects{
            staff{
              id
              name
            }
            subject{
              id
              name
            }
          }
          
          level{
            id
            name
            students{
              id
              name
              email
              img
              gender
            }
            subjects{
              id
              name
              staff{
                id
                name
              }

            }
          }
        }
      }`;

    return this.service.getUnCashed({
      operationName: 'class',
      query: Class,
      variables: { id }
    });
  }

  updateTimeTable(timeTable: any) {
    const updateTimeTable = gql`
      mutation updateTimeTable($classId: Int!, $subjectStaff: [subjectStaffInput!]!){
        updateTimeTable(classId: $classId, subjectStaff: $subjectStaff)
      }
    `;

    interface data {
      updateTimeTable: boolean
    }

    return this.apollo.mutate<data>({
      mutation: updateTimeTable,
      variables: {
        classId: timeTable.classId,
        subjectStaff: timeTable.subjectStaff
      }
    });
  }

  deleteStudentFromClass(classId, studentId) {
    const deleteStudentFromClass = gql`
    mutation deleteStudentFromClass($classId: Int!, $studentId: Int!){
      deleteStudentFromClass(classId: $classId, studentId: $studentId)
    }`;

    interface data {
      deleteStudentFromClass: boolean
    }

    return this.apollo.mutate<data>({
      mutation: deleteStudentFromClass,
      variables: {
        classId,
        studentId
      }
    });
  }

  appendStudentsToClass(classId, studentsId) {
    const appendStudentsToClass = gql`
    mutation appendStudentsToClass($classId: Int!, $studentsId: [Int!]!){
      appendStudentsToClass(classId: $classId, studentsId: $studentsId)
    }`;

    interface data {
      appendStudentsToClass: boolean
    }

    return this.apollo.mutate<data>({
      mutation: appendStudentsToClass,
      variables: {
        classId,
        studentsId
      }
    });
  }
}
