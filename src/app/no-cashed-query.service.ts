import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()

export class NoCashedQueryService {

  constructor(private http: Http) { }

  getUnCashed(payload: { operationName: string, query: string, variables?: any }) {
    return this.http.post('http://10.1.1.28:7070/graphql', payload)
      .map((data) => data.json());
  }

}
