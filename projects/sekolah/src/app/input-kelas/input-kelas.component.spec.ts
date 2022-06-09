import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputKelasComponent } from './input-kelas.component';

describe('InputKelasComponent', () => {
  let component: InputKelasComponent;
  let fixture: ComponentFixture<InputKelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputKelasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputKelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
