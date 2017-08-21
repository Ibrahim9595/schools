import { TestBed, inject } from '@angular/core/testing';

import { LevelsServiceService } from './levels-service.service';

describe('LevelsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LevelsServiceService]
    });
  });

  it('should be created', inject([LevelsServiceService], (service: LevelsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
