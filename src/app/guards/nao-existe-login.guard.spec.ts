// Arquivo: src/app/guards/nao-existe-login.guard.spec.ts
import { TestBed } from '@angular/core/testing';

import { NaoExisteLoginGuard } from './nao-existe-login.guard';

describe('NaoExisteLoginGuard', () => {
  let guard: NaoExisteLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NaoExisteLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
