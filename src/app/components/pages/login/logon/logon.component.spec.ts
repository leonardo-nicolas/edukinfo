// Arquivo: src/app/components/pages/login/logon/logon.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogonComponent } from './logon.component';

describe('LogonComponent', () => {
  let component: LogonComponent;
  let fixture: ComponentFixture<LogonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
