import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Http } from '@angular/http';
import gql from 'graphql-tag';

import { find } from 'lodash';
import 'rxjs/add/operator/map';

import { Staff } from './staff';

@Injectable()
export class StaffService {

  constructor(private apollo: Apollo, private http: Http) { }

  init(limit,offset) {
    const staff = `
      query staff($limit:Int,$offset:Int) {
        staffs(limit:$limit,offset:$offset){
          id
          userId
          name
          email
          gender
          img
          job
          count
          staff_type{
              id
              type
          }
          permissionGroups {
            id
            groupName
          }
        }
      }`;

    return this.getUnCashed({
      operationName: 'staff',
      query: staff,
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

  createStaff(user, staff) {
    const createStaff = gql `
      mutation createStaff($user: UserInputAdd!, $staff: StaffInput!){
        createStaff(user: $user, staff: $staff){
           id
          userId
          name
          email
          gender
          img
          job
          staff_type{
              id
              type
          }
        }
      }`;

      return this.apollo.mutate<Staff>({
        mutation: createStaff,
        variables: {
          user,
          staff
        }
      });
  }

  updateStaff(id, user, staff) {
    const updateStaff = gql `
      mutation updateStaff($id:Int!, $user: UserInputUpdate!, $staff:  StaffInput!){
        updateStaff(id: $id, user: $user, staff: $staff)
      }`;
      return this.apollo.mutate({
        mutation: updateStaff,
        variables: {
          id,
          user,
          staff
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
 