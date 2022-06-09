import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UjianComponent } from './ujian.component';

describe('UjianComponent', () => {
  let component: UjianComponent;
  let fixture: ComponentFixture<UjianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UjianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UjianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
