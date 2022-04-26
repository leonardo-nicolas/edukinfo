import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnDarkModeComponent } from './btn-dark-mode.component';

describe('BtnDarkModeComponent', () => {
  let component: BtnDarkModeComponent;
  let fixture: ComponentFixture<BtnDarkModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnDarkModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnDarkModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
