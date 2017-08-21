import { TestBed, inject } from '@angular/core/testing';

import { ClassServiceService } from './class-service.service';

describe('ClassServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassServiceService]
    });
  });

  it('should be created', inject([ClassServiceService], (service: ClassServiceService) => {
    expect(service).toBeTruthy();
  }));
});
