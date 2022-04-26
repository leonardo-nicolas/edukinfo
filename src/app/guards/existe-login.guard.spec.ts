import { TestBed } from '@angular/core/testing';

import { ExisteLoginGuard } from './existe-login.guard';

describe('ExisteLoginGuard', () => {
  let guard: ExisteLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExisteLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
