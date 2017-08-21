import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NoCashedQueryService } from '../../no-cashed-query.service';
import gql from 'graphql-tag';

import { find } from 'lodash';
import 'rxjs/add/operator/map';


import { PermissionGroup } from './permission-group';
import { Permission } from './permission';
import { User } from './user';

@Injectable()
export class GroupsPermissionsService {

  constructor(private apollo: Apollo, private service: NoCashedQueryService) { }

  init() {
    const permissionGroups = `
      query PermissionGroups {
        permissionGroups{
          id
          groupName
          description
          permissions{
            id
            name
            route
            permissionLevel
          }
          users{
            id
            name
            email
            userType
          }
        }
      }`;

    return this.service.getUnCashed({
      operationName: 'PermissionGroups',
      query: permissionGroups
    });
  }

  getAllPermissions() {
    const permission = gql`
      query permissions{
        permissions{
          id
          name
          route
        }
      }`;

    interface data {
      permissions: Permission[]
    }

    return this.apollo.query<data>({
      query: permission
    });

    // }).map(({ data }) => {
    //   let ret = [];

    //   data.permissions.map(permission => {
    //     let p = find(permissionGroup.permissions, { id: permission.id });

    //     if (p) {
    //       ret.push({
    //         id: permission.id,
    //         name: permission.name,
    //         permissionLevel: p.permissionLevel,
    //         belongsTo: true
    //       });
    //     } else {
    //       ret.push({
    //         id: permission.id,
    //         name: permission.name,
    //         permissionLevel: null,
    //         belongsTo: false
    //       });
    //     }
    //   });

    //   return ret;
    // });
  }

  getAllUsers() {
    const users = gql`
      query users{
        users{
          id
          name
          userType
          email
        }
      }`;

    interface data {
      users: User[]
    };

    return this.apollo.query<data>({
      query: users
    });
  }

  appendPermissionToGroup(permissionGroupId, permissionId, permissionLevel) {
    const appendPermissionToGroup = gql`
      mutation appendPermissionToGroup($permissionGroupId: Int!, $permissionId: Int!, $permissionLevel: Int!){
        appendPermissionToGroup(permissionGroupId: $permissionGroupId, permissionId: $permissionId, permissionLevel: $permissionLevel)
      }
    `;

    interface data {
      appendPermissionToGroup: boolean
    }

    return this.apollo.mutate<data>({
      mutation: appendPermissionToGroup,
      variables: {
        permissionGroupId,
        permissionId,
        permissionLevel
      }
    });
  }

  UpdatePermissionToGroup(permissionGroupId, permissionId, permissionLevel) {
    const updatePermissionOfGroup = gql`
      mutation updatePermissionOfGroup($permissionGroupId: Int!, $permissionId: Int!, $permissionLevel: Int!){
        updatePermissionOfGroup(permissionGroupId: $permissionGroupId, permissionId: $permissionId, permissionLevel: $permissionLevel)
      }
    `;

    interface data {
      updatePermissionOfGroup: boolean
    }

    return this.apollo.mutate<data>({
      mutation: updatePermissionOfGroup,
      variables: {
        permissionGroupId,
        permissionId,
        permissionLevel
      }
    });
  }

  deletePermissionOfGroup(permissionGroupId, permissionId) {
    const deletePermissionOfGroup = gql`
      mutation deletePermissionOfGroup($permissionGroupId: Int!, $permissionId: Int!){
        deletePermissionOfGroup(permissionGroupId: $permissionGroupId, permissionId: $permissionId)
      }`;

    interface data {
      deletePermissionOfGroup: boolean
    }

    return this.apollo.mutate<data>({
      mutation: deletePermissionOfGroup,
      variables: {
        permissionGroupId,
        permissionId
      }
    });

  }

  createPermissionGroup(groupName, description) {
    const createPermissionGroup = gql`
      mutation createPermissionGroup($groupName: String!, $description: String!){
        createPermissionGroup(groupName: $groupName, description: $description){
          id
          groupName
          description
          permissions{
            id
            name
            route
            permissionLevel
          }
        }
      }`;

    interface data {
      createPermissionGroup: PermissionGroup
    }

    return this.apollo.mutate<data>({
      mutation: createPermissionGroup,
      variables: {
        groupName,
        description
      }
    });
  }

  updatePermissionGroup(id, groupName, description) {
    const updatePermissionGroup = gql`
      mutation updatePermissionGroup($id: Int!, $groupName: String!, $description: String!){
        updatePermissionGroup(id: $id, groupName: $groupName, description: $description)
      }`;

    interface data {
      updatePermissionGroup: boolean
    }

    return this.apollo.mutate<data>({
      mutation: updatePermissionGroup,
      variables: {
        id,
        groupName,
        description
      }
    });
  }

  deletePermissionGroup(id) {
    const deletePermissionGroup = gql`
      mutation deletePermissionGroup($id: Int!){
        deletePermissionGroup(id: $id)
      }`;

    interface data {
      deletePermissionGroup: boolean
    }

    return this.apollo.mutate<data>({
      mutation: deletePermissionGroup,
      variables: {
        id
      }
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
