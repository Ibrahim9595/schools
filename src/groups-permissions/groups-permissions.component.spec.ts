import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsPermissionsComponent } from './groups-permissions.component';

describe('GroupsPermissionsComponent', () => {
  let component: GroupsPermissionsComponent;
  let fixture: ComponentFixture<GroupsPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
