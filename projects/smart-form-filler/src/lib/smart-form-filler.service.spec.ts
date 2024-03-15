import { TestBed } from '@angular/core/testing';

import { SmartFormFillerService } from './smart-form-filler.service';

describe('SmartFormFillerService', () => {
  let service: SmartFormFillerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartFormFillerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
