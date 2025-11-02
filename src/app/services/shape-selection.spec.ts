import { TestBed } from '@angular/core/testing';

import { ShapeSelection } from './shape-selection';

describe('ShapeSelection', () => {
  let service: ShapeSelection;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeSelection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
