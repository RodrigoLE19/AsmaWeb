import { TestBed } from '@angular/core/testing';

import { ServiceModal } from './service-modal';

describe('ServiceModal', () => {
  let service: ServiceModal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
