import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCollectiveComponent } from './about-collective.component';

describe('AboutCollectiveComponent', () => {
  let component: AboutCollectiveComponent;
  let fixture: ComponentFixture<AboutCollectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutCollectiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCollectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
