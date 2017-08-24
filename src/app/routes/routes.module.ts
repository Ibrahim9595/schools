import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from '../components/page-not-found/page-not-found.component';
import { GroupsPermissionsComponent } from '../components/groups-permissions/groups-permissions.component';
import { ParentsComponent } from '../components/parents/parents.component';
import { StudentComponent } from '../components/student/student.component';
import { StaffComponent } from '../components/staff/staff.component';
import { LevelsComponent } from '../components/levels/levels.component';
import { ClassComponent } from '../components/class/class.component';
import { SubjectComponent } from '../components/subject/subject.component';

const routes: Routes = [
  { path: '',   redirectTo: '/permission-groups', pathMatch: 'full' },
  {path: 'permission-groups', component: GroupsPermissionsComponent},
  {path: 'parents', component: ParentsComponent},
  {path: 'student', component: StudentComponent},
  {path: 'staff', component: StaffComponent},
  {path: 'levels', component: LevelsComponent},
  {path: 'class/:id', component: ClassComponent},
  {path: 'subject/:id', component: SubjectComponent},
  {path: '**', component: PageNotFoundComponent}
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class RoutesModule { }
