import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ApolloModule } from 'apollo-angular';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule, FormControl } from '@angular/forms';
import { RoutesModule } from './routes/routes.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GroupsPermissionsComponent } from './components/groups-permissions/groups-permissions.component';
import { ParentsComponent } from './components/parents/parents.component';
import { FilterPipe } from './filter.pipe';
import { FindPipe } from './find.pipe';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { LevelsComponent } from './components/levels/levels.component';
import { NoCashedQueryService } from './no-cashed-query.service';
import { ClassComponent } from './components/class/class.component';
import { TimetableCellComponent } from './components/timetable-cell/timetable-cell.component';
import { SubjectComponent } from './components/subject/subject.component';
import { TimetableComponent } from './components/timetable/timetable.component';


const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://10.1.1.28:7070/graphql',
    opts: {
      credentials: 'same-origin'
    }
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    GroupsPermissionsComponent,
    ParentsComponent,
    FilterPipe,
    FindPipe,
    DynamicFormComponent,
    LevelsComponent,
    ClassComponent,
    TimetableCellComponent,
    SubjectComponent,
    TimetableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RoutesModule,
    HttpModule,
    NgbModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    ApolloModule.forRoot(provideClient),


  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [NoCashedQueryService],
  bootstrap: [AppComponent]
})

export class AppModule { }
