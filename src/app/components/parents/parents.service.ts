import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Http } from '@angular/http';
import gql from 'graphql-tag';

import { find } from 'lodash';
import 'rxjs/add/operator/map';

import { Parent } from './parent';

@Injectable()
export class ParentsService {

  constructor(private apollo: Apollo, private http: Http) { }

  init() {
    const Parents = `
      query Parents {
        parents{
          id
          userId
          userTypeId
          name
          email
          job
          children {
            id
            name
            email
            userId
            userTypeId
          }
        }
      }`;

    return this.getUnCashed({
      operationName: 'Parents',
      query: Parents
    });
  }

  getUnCashed(payload: { operationName: string, query: string, variables?: any }) {
    return this.http.post('http://localhost:7070/graphql', payload)
      .map((data) => data.json());
  }

  createParent(user, parent) {
    const createParent = gql `
      mutation createParent($user: UserInputAdd!, $parent: ParentInput!){
        createParent(user: $user, parent: $parent){
          id
          userId
          userTypeId
          name
          email
          job
          children {
            id
          }
        }
      }`;

      return this.apollo.mutate<Parent>({
        mutation: createParent,
        variables: {
          user,
          parent
        }
      });
  }

  updateParent(id, user, parent) {
    const updateParent = gql`
      mutation updateParent($id:Int!, $user: UserInputUpdate!, $parent: ParentInput!){
        updateParent(id: $id, user: $user, parent: $parent)
      }`;

      return this.apollo.mutate<Parent>({
        mutation: updateParent,
        variables: {
          id,
          user,
          parent
        }
      });
  }

  deleteUser(userId) {
     const deleteUser = gql `
      mutation deleteUser($userId:Int!){
       deleteUser(userId: $userId)
      }`;

      return this.apollo.mutate<Parent>({
        mutation: deleteUser,
        variables: {
          userId
        }
      });
  }

  getParentDetails(id) {
    const Parent = gql`
      query Parent($id: Int!) {
        parent(id: $id){
          id
          userId
          userTypeId
          name
          email
          job
          children {
            id
            name
            email
            userId
            userTypeId
          }
          permissionGroups {
            id
            groupName
            permissions{
              id
              name
              permissionLevel
            }
          }
        }
      }`;

      return this.apollo.query<Parent>({
        query: Parent,
        variables: {id}
      });
  }
}
