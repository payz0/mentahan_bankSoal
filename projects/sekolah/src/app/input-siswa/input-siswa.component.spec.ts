import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSiswaComponent } from './input-siswa.component';

describe('InputSiswaComponent', () => {
  let component: InputSiswaComponent;
  let fixture: ComponentFixture<InputSiswaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputSiswaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSiswaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
