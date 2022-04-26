import { TestBed } from '@angular/core/testing';

import { RotaDePesquisaService } from './rota-de-pesquisa.service';

describe('RotaDePesquisaService', () => {
  let service: RotaDePesquisaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RotaDePesquisaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
