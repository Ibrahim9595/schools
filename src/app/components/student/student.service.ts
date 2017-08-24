import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Http } from '@angular/http';
import gql from 'graphql-tag';

import { find } from 'lodash';
import 'rxjs/add/operator/map';

import { student } from './student';

@Injectable()
export class StudentService {

  constructor(private apollo: Apollo, private http: Http) { }

  init(limit,offset) {
    const students = `
      query students($limit:Int,$offset:Int) {
        students(limit:$limit,offset:$offset){
          id
          userId
          name
          email
          gender
          img
          count
          level{
            id 
            name
          }
          parent{
              id
              name
              img
              email
              job
              gender
          }
          class{
              name
              level {
    					  id
                name
    					}
          }
          
          permissionGroups {
            id
            groupName
            }
        }
      }`;

    return this.getUnCashed({
      operationName: 'students',
      query: students,
       variables: {
          limit,
          offset
        }
    });
  }

  getUnCashed(payload: { operationName: string, query: string, variables?: any }) {
    return this.http.post('http://10.1.1.28:7070/graphql', payload)
      .map((data) => data.json());
  }
    getAllParents(){
      const parents=gql `query parents{
          parents{
            id 
            name
            img
            gender
            job
            email
          }
      }`;
      return this.apollo.watchQuery<any>({
        query:parents
      });
    }
  getStafftypes(){
    const StaffType =gql `
        query StaffType{
          staffTypes{
            id
            type
          }
        }
    `;
    return this.apollo.watchQuery<any>({
      query: StaffType
    });
  }
 getAllLevels(){
   const getlevels = gql `
    query levels {
        levels{
          id
          
          name
        }
      }
   `;
    return this.apollo.watchQuery<any>({
      query: getlevels
    });
 }
  createStudent(user, student) {
    const createStudent = gql `
      mutation createStudent($user: UserInputAdd!, $student: StudentInput!){
        createStudent(user: $user, student: $student){
          id
          userId
          name
          email
          gender
          img
          level{
            id
            name
          }
        }
      }`;

      return this.apollo.mutate<student>({
        mutation: createStudent,
        variables: {
          user,
          student
        }
      });
  }

  updateStudent(id, user, student) {
    const updateStudent = gql `
      mutation updateStudent($id:Int!, $user: UserInputUpdate!, $student:  StudentInput!){
        updateStudent(id: $id, user: $user, student: $student)
      }`;
      return this.apollo.mutate({
        mutation: updateStudent,
        variables: {
          id,
          user,
          student
        }
      });
  }

  deleteUser(userId) {
     const deleteUser = gql `
      mutation deleteUser($userId:Int!){
       deleteUser(userId: $userId)
      }`;

      return this.apollo.mutate({
        mutation: deleteUser,
        variables: {
          userId
        }
      });
  }

  getAllPermissionGroups() {
    const PermissionGroups = gql`
      query PermissionGroups{
        permissionGroups{
          id
          groupName
          description
        }
      }`;
      return this.apollo.watchQuery<any>({
        query: PermissionGroups
      });
  }
     addUserToPermissionGroup(permissionGroupId, userId) {
    const addUserToPermissionGroup = gql`
      mutation addUserToPermissionGroup($permissionGroupId: Int!, $userId: Int!){
        addUserToPermissionGroup(permissionGroupId: $permissionGroupId, userId: $userId)
      }
    `;

    interface data {
      addUserToPermissionGroup: boolean
    }

    return this.apollo.mutate<data>({
      mutation: addUserToPermissionGroup,
      variables: {
        permissionGroupId,
        userId
      }
    });
  }

  deleteUserFromPermissionGroup(permissionGroupId, userId) {
    const deleteUserFromPermissionGroup = gql`
      mutation deleteUserFromPermissionGroup($permissionGroupId: Int!, $userId: Int!){
        deleteUserFromPermissionGroup(permissionGroupId: $permissionGroupId, userId: $userId)
      }
    `;

    interface data {
      deleteUserFromPermissionGroup: boolean
    }

    return this.apollo.mutate<data>({
      mutation: deleteUserFromPermissionGroup,
      variables: {
        permissionGroupId,
        userId
      }
    });
  }
}
 