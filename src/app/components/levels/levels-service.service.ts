import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NoCashedQueryService } from '../../no-cashed-query.service';
import gql from 'graphql-tag';

import { find } from 'lodash';
import 'rxjs/add/operator/map';

@Injectable()

export class LevelsServiceService {

  constructor(private apollo: Apollo, private service: NoCashedQueryService) { }

  init() {
    let levels = `
      query levels{
        levels{
          id
          name
          priority
          subjects{
            id
            name
            details
            syllabus
            levelId
          }
          classes{
            id
            name
            capacity
            minGrade
            levelId
          }
        }
      }`;

    return this.service.getUnCashed({
      operationName: 'levels',
      query: levels,
      variables: null
    });
  }

  createLevel(level) {
    const createLevel = gql`
      mutation createLevel($level: LevelInput!){
        createLevel(level: $level){
          id
          name
          priority
          subjects{
            id
            name
          }
          classes{
            id
            name
            capacity
            minGrade
            levelId
          }
        }
      }
    `;

    interface data {
      createLevel: any
    }

    return this.apollo.mutate<data>({
      mutation: createLevel,
      variables: {
        level
      }
    });
  }

  updateLevel(level) {
    const updateLevel = gql`
      mutation updateLevel($id: Int!, $level: LevelInput!){
        updateLevel(id: $id, level: $level)
      }
    `;

    interface data {
      updateLevel: boolean
    }

    return this.apollo.mutate<data>({
      mutation: updateLevel,
      variables: {
        id: level.id,
        level
      }
    });
  }


  deleteLevel(levelId) {
    const deleteLevel = gql`
      mutation deleteLevel($levelId: Int!){
        deleteLevel(id: $levelId)
      }
    `;

    interface data {
      deleteLevel: boolean
    }

    return this.apollo.mutate<data>({
      mutation: deleteLevel,
      variables: {
        levelId
      }
    });
  }

  createClass(Class) {
    const createClass = gql`
      mutation createClass($class: ClassInput!){
        createClass(class: $class){
          id
          name
          capacity
          minGrade
          levelId
        }
      }
    `;

    interface data {
      createClass: any
    }

    return this.apollo.mutate<data>({
      mutation: createClass,
      variables: {
        class: Class
      }
    });
  }

  updateClass(Class) {
    const updateClass = gql`
      mutation updateClass($id: Int!, $class: ClassInput!){
        updateClass(id: $id, class: $class)
      }
    `;

    interface data {
      updateClass: boolean
    }

    return this.apollo.mutate<data>({
      mutation: updateClass,
      variables: {
        id: Class.id,
        class: Class
      }
    });
  }

  deleteClass(id) {
    const deleteClass = gql`
      mutation deleteClass($id: Int!){
        deleteClass(id: $id)
      }
    `;

    interface data {
      deleteClass: boolean
    }

    return this.apollo.mutate<data>({
      mutation: deleteClass,
      variables: {
        id
      }
    });
  }

  createSubject(subject) {
    const createSubject = gql`
      mutation ccreateSubject($subject: SubjectInput!){
        createSubject(subject: $subject){
          id
          name
          details
          syllabus
          levelId
        }
      }
    `;

    interface data {
      createSubject: any
    }

    return this.apollo.mutate<data>({
      mutation: createSubject,
      variables: {
        subject
      }
    });
  }

  updateSubject(subject) {
    const updateSubject = gql`
      mutation updateSubject($id: Int!, $subject: SubjectInput!){
        updateSubject(id: $id, subject: $subject)
      }
    `;

    interface data {
      updateSubject: boolean
    }

    return this.apollo.mutate<data>({
      mutation: updateSubject,
      variables: {
        id: subject.id,
        subject
      }
    });
  }

  deleteSubject(id) {
    const deleteSubject = gql`
      mutation deleteSubject($id: Int!){
        deleteSubject(id: $id)
      }
    `;

    interface data {
      deleteSubject: boolean
    }

    return this.apollo.mutate<data>({
      mutation: deleteSubject,
      variables: {
        id
      }
    });
  }
}
