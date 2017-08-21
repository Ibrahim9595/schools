import { TestBed, inject } from '@angular/core/testing';

import { NoCashedQueryService } from './no-cashed-query.service';

describe('NoCashedQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoCashedQueryService]
    });
  });

  it('should be created', inject([NoCashedQueryService], (service: NoCashedQueryService) => {
    expect(service).toBeTruthy();
  }));
});
