import { TestBed } from '@angular/core/testing';

import { VeronaService } from './verona.service';

describe('VeronaService', () => {
  let service: VeronaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeronaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
