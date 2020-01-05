import { TestBed } from '@angular/core/testing';

import { ThreejsService } from './threejs.service';

describe('ThreejsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThreejsService = TestBed.get(ThreejsService);
    expect(service).toBeTruthy();
  });
});
