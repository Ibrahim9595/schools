import { TestBed, inject } from '@angular/core/testing';

import { SubjectServiceService } from './subject-service.service';

describe('SubjectServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubjectServiceService]
    });
  });

  it('should be created', inject([SubjectServiceService], (service: SubjectServiceService) => {
    expect(service).toBeTruthy();
  }));
});
