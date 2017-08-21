import { TestBed, inject } from '@angular/core/testing';

import { GroupsPermissionsService } from './groups-permissions.service';

describe('GroupsPermissionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupsPermissionsService]
    });
  });

  it('should be created', inject([GroupsPermissionsService], (service: GroupsPermissionsService) => {
    expect(service).toBeTruthy();
  }));
});
