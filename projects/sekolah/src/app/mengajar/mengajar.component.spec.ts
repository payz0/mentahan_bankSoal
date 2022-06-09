import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MengajarComponent } from './mengajar.component';

describe('MengajarComponent', () => {
  let component: MengajarComponent;
  let fixture: ComponentFixture<MengajarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MengajarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MengajarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
