import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputGuruComponent } from './input-guru.component';

describe('InputGuruComponent', () => {
  let component: InputGuruComponent;
  let fixture: ComponentFixture<InputGuruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputGuruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputGuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
