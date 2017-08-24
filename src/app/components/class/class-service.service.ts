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

  absence(dateStart, dateEnd, classId, subjectId?) {
    let abcence = `
    query absence($dateStart: String!, $dateEnd: String!, $classId: Int!, $subjectId: Int){
      absence(dateStart: $dateStart, dateEnd:$dateEnd, classId:$classId, subjectId: $subjectId){
        date
        staff{
          id
          name
          email
          img
        }
        student{
          id
          name
          email
          img
        }
        subject{
          id
          name
        }
        notes
      }
    }`;

    return this.service.getUnCashed({
      operationName: 'absence',
      query: abcence,
      variables: {
        dateStart,
        dateEnd,
        classId,
        subjectId
      }
    });
  }

  appendAbsenceDay(date, classId, staffId, subjectId, absentStudents) {
    const appendAbsenceDay = gql`
    mutation appendAbsenceDay($date: String!, $classId: Int!, $staffId: Int!, $subjectId: Int!, $absentStudents: [AbsentStudent!]!){
      appendAbsenceDay(date: $date, classId: $classId, staffId: $staffId, subjectId: $subjectId, absentStudents: $absentStudents)
    }`;

    interface data {
      appendAbsenceDay: boolean
    }

    return this.apollo.mutate<data>({
      mutation: appendAbsenceDay,
      variables: {
        date,
        classId,
        staffId,
        subjectId,
        absentStudents
      }
    });
  }

  assignments(classId, subjectId) {
    let assignments = gql`
    query assignments($classId: Int!, $subjectId: Int!){
      assignments(classId:$classId, subjectId: $subjectId){
        id
        notes
        finalScore
        dueDate
        description
      
        staff{
          id
          name
        }

        results{
          notes
          score
          student{
            id
          }
        }
      }
    }`;

    interface data {
      assignments: any;
    };

    return this.apollo.watchQuery<data>({
      query: assignments,
      variables: {
        classId,
        subjectId
      }
    });
  }
}
